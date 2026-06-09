const WP_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL;

function stripHtml(html) {
    return html ? html.replace(/<[^>]+>/g, '').trim() : '';
}

function mapPost(post) {
    const acf = post.acf || {};

    return {
        id: post.id,
        slug: post.slug,
        title: post.title?.rendered || '',
        excerpt: stripHtml(post.excerpt?.rendered || ''),
        content: post.content?.rendered || '',
        category: post._embedded?.['wp:term']?.[0]?.[0]?.name || 'Uncategorized',
        categorySlug: post._embedded?.['wp:term']?.[0]?.[0]?.slug || '',
        tags: post._embedded?.['wp:term']?.[1]?.map(t => t.name) || [],
        author: post._embedded?.author?.[0]?.name || 'Unknown',
        date: new Date(post.date).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric'
        }),
        readTime: acf.read_time || '5 min read',
        featured: acf.featured || false,
        iconColor: acf.icon_color || 'var(--primary-blue)',
        image: post._embedded?.['wp:featuredmedia']?.[0]?.source_url || null,
    };
}

// GET all posts — supports search, category id, tag id
export async function getAllPosts({ perPage = 20, search = '', categoryId = '', tagId = '' } = {}) {
    let url = `${WP_URL}/wp-json/wp/v2/posts?_embed&per_page=${perPage}&status=publish`;
    if (search) url += `&search=${encodeURIComponent(search)}`;
    if (categoryId) url += `&categories=${categoryId}`;
    if (tagId) url += `&tags=${tagId}`;

    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error(`Failed to fetch posts: ${res.status}`);
    const posts = await res.json();
    return posts.map(mapPost);
}

// GET single post by slug
export async function getPostBySlug(slug) {
    const res = await fetch(
        `${WP_URL}/wp-json/wp/v2/posts?slug=${slug}&_embed`,
        { next: { revalidate: 60 } }
    );
    if (!res.ok) throw new Error('Failed to fetch post');
    const posts = await res.json();
    return posts[0] ? mapPost(posts[0]) : null;
}

// GET all categories
export async function getCategories() {
    const res = await fetch(
        `${WP_URL}/wp-json/wp/v2/categories?per_page=50&hide_empty=true`,
        { next: { revalidate: 300 } }
    );
    if (!res.ok) throw new Error('Failed to fetch categories');
    return res.json(); // [{ id, name, slug, count }]
}

// GET all tags
export async function getTags() {
    const res = await fetch(
        `${WP_URL}/wp-json/wp/v2/tags?per_page=100&hide_empty=true`,
        { next: { revalidate: 300 } }
    );
    if (!res.ok) throw new Error('Failed to fetch tags');
    return res.json(); // [{ id, name, slug, count }]
}
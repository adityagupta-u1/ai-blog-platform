import { clsx, type ClassValue } from "clsx";
import sanitizeHtml from 'sanitize-html';
import { twMerge } from "tailwind-merge";
// import { redis } from "./redis";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function SanitizeHtml(html: string): string {
  const clean = sanitizeHtml(html, {
    allowedTags: [
      'p', 'strong', 'em', 'u', 's',
      'h1', 'h2', 'h3', 'ul', 'ol', 'li',
      'blockquote', 'code', 'pre', 'br', 'a'
    ],
    allowedAttributes: {
      a: ['href', 'target', 'rel'],
      '*': ['class'], // if you're using Tailwind or other class-based styling
    },
    allowedSchemes: ['http', 'https', 'mailto'],
    allowProtocolRelative: true,
  });

  return clean;

}

export const handleUpload = async (file: File) => {


    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'uploads'); // Replace with your

    const res = await fetch("https://api.cloudinary.com/v1_1/donohd08r/image/upload", {
        method: "POST",
        body: formData,
    });

    const data = await res.json();
    if (data.secure_url) {
      return data.secure_url; // Return the uploaded image URL
    } else {
        console.error("Image upload failed:", data);
    }
}


// export async function deleteTagCompletely(tag:string) {
//   // Get all slugs that have this tag
//   const slugs = await redis.smembers(`tag:${tag}`);

//   for (const slug of slugs) {
//     const key = `post:${slug}`;
//     const data = await redis.get(key) as unknown as string
//     if (!data) continue;

//     const post = JSON.parse(data) as unknown as {tags:string[]}
//     const updatedTags = post.tags?.filter(t => t !== tag);

//     // Update the post without the deleted tag
//     await redis.set(key, JSON.stringify({ ...post, tags: updatedTags }));
//   }

//   // Now remove from global sets and delete tag mapping
//   await redis.srem('tags', tag);
//   await redis.del(`tag:${tag}`);
// }
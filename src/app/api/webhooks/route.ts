import { env } from '@/env';
import { db } from '@/server/db';
import { users } from '@/server/db/schema'; // Import the users table definition
// 

import { Webhook } from 'svix';

export async function POST(req: Request) {
    // Check if the request method is POST
    console.log("Webhook request received");
        const svix_id = req.headers.get('svix-id') ?? "";
        const svix_timestamp = req.headers.get('svix-timestamp') ?? "";
        const svix_signature = req.headers.get('svix-signature') ?? "";

        const body = await req.text();

        const svix = new Webhook(env.CLERK_WEBHOOK_SIGNING_SECRET);

        let evt;

        try{
            evt = svix.verify(body,{
                "svix-id": svix_id,
                "svix-timestamp": svix_timestamp,
                "svix-signature": svix_signature
            }) as 
            {
                type: string;
                data:{
                    id:string;
                    first_name: string;
                    last_name: string;
                    email_addresses: {
                        email_address: string;
                        verification: {
                            status:string;
                        };
                    }[];
                    image_url:string;   
            }}
            if(evt.type === "user.created"){
                console.log("new user")
                const isAdminUser = evt.data.email_addresses[0].email_address === env.ADMIN_EMAIL;
                const role = isAdminUser ? "admin" : "user"; // Set role based on email
                const newUser = await db.insert(users).values({
                        id: evt.data.id,
                        name: `${evt.data.first_name} ${evt.data.last_name}`,
                        email: evt.data.email_addresses[0].email_address,
                        image: evt.data.image_url,
                        role: role // Set role based on email
                    }).returning({insertedId: users.id});
                // // Update Clerk user metadata with role
                // // Note: Ensure that the user exists in Clerk before updating metadata
                console.log("User created: ", newUser);
            }
            if(evt.type === "user.updated"){
                console.log("User updated: ", evt.data);
            }
            if(evt.type === "user.deleted"){
                console.log("User deleted: ", evt.data);
            }
        } catch {
            return new Response("Invalid signature", {
                status: 401,
                statusText: "Unauthorized"
            }); 
        }

        console.log("Webhook data: ", evt);
        return new Response("OK", { status: 200 });
}
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

supabase.from("orders")
  .select(`
    id,
    order_items (
      id,
      quantity,
      price,
      variant:product_variants (
        id,
        name,
        product:products (
          name,
          image_url
        )
      )
    )
  `)
  .limit(1)
  .then(res => {
     console.log(JSON.stringify(res.data, null, 2));
     console.log("Error:", res.error);
  });

import type { LoaderFunction, MetaFunction } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";

interface Env {
	DB: D1Database;
}

type Customer = {
  CustomerID: number;
  CompanyName: string;
  ContactName: string;
}

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    {
      name: "description",
      content: "Welcome to Remix on Cloudflare!",
    },
  ];
};

export const loader: LoaderFunction = async ({ context, params }) => {
  const env = context.cloudflare.env as Env;
  const { results } = await env.DB.prepare("SELECT * FROM Customers").all<Customer>();
  return json(results);
}

export default function Index() {
  const customers = useLoaderData<typeof loader>() as Customer[];

  return (
    <div className="font-sans p-4">
      <h1 className="text-3xl">Welcome to Remix on Cloudflare</h1>
      <ul className="list-disc mt-4 pl-6 space-y-2">
        {customers.map((customer) => (
          <li key={customer.CustomerID}>
            {customer.CompanyName}, {customer.ContactName}
          </li>
        ))}
      </ul>
    </div>
  );
}

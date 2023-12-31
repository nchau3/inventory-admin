import { useEffect } from "react";
import { json } from "@remix-run/node";
import { useActionData, useLoaderData, useNavigation, useSubmit } from "@remix-run/react";
import {
  Page,
  Layout,
  Text,
  Card,
  Button,
  BlockStack,
  Box,
  List,
  Link,
  InlineStack,
  IndexTable,
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import { getKits, getProducts } from "../models/kit";

export const loader = async ({ request }) => {
  const { admin, session } = await authenticate.admin(request);
  const kits = await getKits(session.shop, admin.graphql);
  const productVariants = await getProducts(admin.graphql);


  return json({
    kits
  });
};

export const action = async ({ request }) => {
  const { admin } = await authenticate.admin(request);

};

const KitsTable = ({ kits }) => (
  <IndexTable
    resourceName={{
      singular: "Kit",
      plural: "Kits"
    }}
    itemCount={kits.length}
    headings={[
      { title: "Title" },
      { title: "SKU" }
    ]}
    selectable={false}
    >
      {kits.map((kit) => (
        <KitsTableRow key={kit.id} kit={kit} />
      ))}
    </IndexTable>
);

const KitsTableRow = ({ kit }) => (
  <IndexTable.Row id={kit.id} position={kit.id}>
    <IndexTable.Cell>
      {kit.title}
    </IndexTable.Cell>
    <IndexTable.Cell>
      {kit.sku}
    </IndexTable.Cell>
  </IndexTable.Row>
);

export default function Index() {
  const nav = useNavigation();
  const { kits } = useLoaderData();

  return (
    <Page>
      <ui-title-bar title="Inventory Admin">
      </ui-title-bar>
      <BlockStack gap="500">
        <Layout>
          <Layout.Section>
            <Card>
              <KitsTable kits={kits} />
            </Card>
          </Layout.Section>
        </Layout>
      </BlockStack>
    </Page>
  );
}

import db from "../db.server";

export async function getKit(id, graphql) {
    const kit = await db.kit.findFirst({ where: { id }});

    if (!kit) {
        return null;
    }

    return supplementKit(kit, graphql);
}

export async function getKits(shop, graphql) {
    const kits = await db.kit.findMany({
        where: { shop },
        orderBy: { id: "desc" }
    })

    if (kits.length === 0) return [];

    return Promise.all(
        kits.map((kit) => supplementKit(kit, graphql))
    );
}

async function supplementKit(kit, graphql) {
    const response = await graphql(
        `
            query supplementKit($id: ID!) {
                productVariant(id: $id) {
                    title
                    sku
                }
            }
        `,
        {
            variables: {
                id: kit.productVariantId
            },
        }
    );

    const {
        data: { productVariant },
    } = await response.json();
    
    return {
        ...kit,
        title: productVariant.title,
        sku: productVariant.sku
    }
}

export async function getProducts(graphql) {
    const response = await graphql(
        `
            query supplementKit {
                productVariants(first: 50) {
                    nodes {
                        id
                        title
                        sku
                    }
                }
            }
        `,
    );

    const {
        data
    } = await response.json();

    return data.productVariants.nodes;
}
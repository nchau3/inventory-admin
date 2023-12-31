import db from "../db.server";

export async function getItem(id) {
    const item = await db.item.findFirst({ where: { id }});

    if (!item) {
        return null;
    }

    return item;
}

export async function getItems(shop) {
    const items = await db.item.findMany({
        where: { shop },
        orderBy: { id: "desc" }
    })

    if (items.length === 0) return [];

    return items;
}
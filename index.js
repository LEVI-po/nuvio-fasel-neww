const { addonBuilder, serveHTTP } = require("stremio-addon-sdk");

const builder = new addonBuilder({
    id: "org.nuvio.faselhd",
    version: "1.0.0",
    name: "فاصل إعلاني",
    description: "إضافة فاصل إعلاني لمشاهدة الأفلام والمسلسلات",
    resources: ["catalog", "meta", "stream"],
    types: ["movie", "series"],
    catalogs: [
        { type: "movie", id: "fasel_movies", name: "فاصل - الأفلام" },
        { type: "series", id: "fasel_series", name: "فاصل - المسلسلات" }
    ],
    idPrefixes: ["fasel_"]
});

builder.defineCatalogHandler(async ({ type }) => {
    return {
        metas: [
            {
                id: "fasel_1",
                type: type,
                name: type === "movie" ? "فيلم تجريبي لفاصل" : "مسلسل تجريبي لفاصل",
                poster: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500",
                description: "تجربة تشغيل السيرفر بنجاح"
            }
        ]
    };
});

builder.defineMetaHandler(async ({ id }) => {
    return {
        meta: {
            id: id,
            name: "عمل تجريبي",
            poster: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500",
            description: "تفاصيل العمل التجريبي"
        }
    };
});

builder.defineStreamHandler(async ({ id }) => {
    return {
        streams: [
            {
                title: "سيرفر المشاهدة التجريبي",
                url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
            }
        ]
    };
});

serveHTTP(builder.getInterface(), { port: process.env.PORT || 7000 });

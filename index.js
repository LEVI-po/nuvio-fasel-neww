const { addonBuilder, serveHTTP } = require("stremio-addon-sdk");

// تعريف المزودين (Providers) المتاحة في إضافتك
const providers = [
    { id: "fasel", name: "فاصل إعلاني", type: "movie/series", active: true },
    { id: "mycima", name: "ماي سيما", type: "movie/series", active: true },
    { id: "egybest", name: "ايجي بست", type: "movie/series", active: true },
    { id: "arabseed", name: "عرب سيد", type: "movie/series", active: true }
];

const builder = new addonBuilder({
    id: "org.nuvio.multiprovider",
    version: "1.0.0",
    name: "مكتبة المزودين العرب",
    description: "إضافة تجمع عدة مزودين للمشاهدة في مكان واحد",
    resources: ["catalog", "meta", "stream"],
    types: ["movie", "series"],
    catalogs: providers.map(p => ({
        type: "movie",
        id: `provider_${p.id}`,
        name: `${p.name} - أفلام`
    })),
    idPrefixes: ["prov_"]
});

// معالج الكتالوج لكل مزود
builder.defineCatalogHandler(async ({ id }) => {
    const metas = [
        {
            id: `prov_${id}_test1`,
            type: "movie",
            name: "تجربة مزودين - فيلم تجريبي",
            poster: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500",
            description: "هذا فيلم تجريبي للتأكد من عمل قائمة المزودين بنجاح."
        }
    ];
    return { metas };
});

// معالج تفاصيل الفيلم
builder.defineMetaHandler(async ({ id }) => {
    return {
        meta: {
            id: id,
            type: "movie",
            name: "فيلم تجريبي للمزودين",
            poster: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500",
            description: "تفاصيل الفيلم التجريبي الخاص بنظام المزودين المتعددين."
        }
    };
});

// معالج روابط البث (Streams)
builder.defineStreamHandler(async ({ id }) => {
    return {
        streams: [
            {
                title: "سيرفر المشاهدة الأساسي - عالي الجودة",
                url: "https://www.w3schools.com/html/mov_bbb.mp4"
            }
        ]
    };
});

serveHTTP(builder.getInterface(), { port: process.env.PORT || 7000 });

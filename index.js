const { addonBuilder, serveHTTP } = require("stremio-addon-sdk");

// تعريف المزودين (Providers) بشكل منظم واحترافي
const providers = [
    { id: "fasel", name: "فاصل إعلاني", description: "مزود أفلام ومسلسلات فاصل إعلاني" },
    { id: "mycima", name: "ماي سيما", description: "مزود أفلام ومسلسلات ماي سيما" },
    { id: "egybest", name: "ايجي بست", description: "مزود أفلام ومسلسلات ايجي بست" },
    { id: "arabseed", name: "عرب سيد", description: "مزود أفلام ومسلسلات عرب سيد" }
];

const builder = new addonBuilder({
    id: "org.nuvio.multiprovider",
    version: "1.1.0",
    name: "مكتبة المزودين العرب",
    description: "إضافة متكاملة تعرض عدة مزودين للمشاهدة في مكان واحد",
    resources: ["catalog", "meta", "stream"],
    types: ["movie", "series"],
    catalogs: providers.map(p => ({
        type: "movie",
        id: `provider_${p.id}`,
        name: p.name
    })),
    idPrefixes: ["prov_"]
});

// معالج الكتالوج لكل مزود لضمان ظهور المحتوى
builder.defineCatalogHandler(async ({ id }) => {
    const providerId = id.replace("provider_", "");
    const providerObj = providers.find(p => p.id === providerId) || providers[0];
    
    return {
        metas: [
            {
                id: `prov_${providerId}_sample1`,
                type: "movie",
                name: `[${providerObj.name}] - اختر للمشاهدة`,
                poster: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500",
                description: `${providerObj.description} - اضغط هنا لعرض السيرفرات المتاحة.`
            }
        ]
    };
});

// معالج تفاصيل المحتوى
builder.defineMetaHandler(async ({ id }) => {
    return {
        meta: {
            id: id,
            type: "movie",
            name: "قائمة سيرفرات المزود",
            poster: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500",
            description: "اختر جودة المشاهدة أو السيرفر المناسب لك."
        }
    };
});

// معالج روابط البث (Streams)
builder.defineStreamHandler(async ({ id }) => {
    return {
        streams: [
            {
                title: "سيرفر التشغيل السريع - جودة عالية HD",
                url: "https://www.w3schools.com/html/mov_bbb.mp4"
            }
        ]
    };
});

serveHTTP(builder.getInterface(), { port: process.env.PORT || 7000 });

const { addonBuilder, serveHTTP } = require('stremio-addon-sdk');

const manifest = {
    "id": "org.nuvio.multiprovider",
    "version": "1.1.0",
    "name": "مكتبة المزودين العرب",
    "description": "إضافة متكاملة تعرض عدة مزودين للمشاهدة في مكان واحد",
    "resources": ["catalog", "meta", "stream"],
    "types": ["movie", "series"],
    "catalogs": [
        { "type": "movie", "id": "provider_fasel", "name": "فاصل" },
        { "type": "movie", "id": "provider_mycima", "name": "ماي سيما" },
        { "type": "movie", "id": "provider_egybest", "name": "إيجي بست" },
        { "type": "movie", "id": "provider_arabseed", "name": "عرب سيد" }
    ],
    "idPrefixes": ["prov_"]
};

const builder = new addonBuilder(manifest);

// تعريف الكاتالوجات والأفلام الوهمية كمثال عشان تظهر وتشتغل الروابط
builder.defineCatalogHandler(async ({ type, id }) => {
    let metas = [];
    if (id === "provider_fasel") {
        metas = [
            { id: "prov_1", type: "movie", name: "فيلم تجريبي - فاصل", poster: "https://via.placeholder.com/300x450" }
        ];
    } else if (id === "provider_mycima") {
        metas = [
            { id: "prov_2", type: "movie", name: "فيلم تجريبي - ماي سيما", poster: "https://via.placeholder.com/300x450" }
        ];
    }
    return { metas };
});

// تعريف معلومات الفيلم
builder.defineMetaHandler(async ({ type, id }) => {
    return {
        meta: {
            id: id,
            type: type,
            name: "محتوى تجريبي للمزود",
            description: "هذا محتوى تجريبي للتأكد من عمل الروابط والتشغيل بنجاح.",
            poster: "https://via.placeholder.com/300x450"
        }
    };
});

// تعريف روابط التشغيل (Streams) عشان يشتغل الفيلم معك 100%
builder.defineStreamHandler(async ({ type, id }) => {
    const streams = [
        {
            title: "سيرفر رئيسي - 1080p",
            url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
        }
    ];
    return { streams };
});

serveHTTP(builder.interface, { port: process.env.PORT || 7000 });

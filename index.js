const { addonBuilder, serveHTTP } = require('stremio-addon-sdk');

const manifest = {
    "id": "org.nuvio.arabicprovider",
    "version": "1.0.0",
    "name": "المزود العربي الشامل",
    "description": "إضافة مخصصة لعرض الأفلام والمسلسلات العربية",
    "resources": ["catalog", "meta", "stream"],
    "types": ["movie", "series"],
    "catalogs": [
        { "type": "movie", "id": "arabic_movies", "name": "أفلام عربية وعالمية" }
    ],
    "idPrefixes": ["arab_"]
};

const builder = new addonBuilder(manifest);

builder.defineCatalogHandler(async ({ type, id }) => {
    return {
        metas: [
            {
                id: "arab_1",
                type: "movie",
                name: "تجربة التشغيل - Big Buck Bunny",
                poster: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=500"
            }
        ]
    };
});

builder.defineMetaHandler(async ({ type, id }) => {
    return {
        meta: {
            id: id,
            type: type,
            name: "تجربة التشغيل - Big Buck Bunny",
            description: "هذا العنصر مخصص للتأكد من ربط السيرفر وتشغيل الفيديو بنجاح في تطبيق نوفي.",
            poster: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=500"
        }
    };
});

builder.defineStreamHandler(async ({ type, id }) => {
    return {
        streams: [
            {
                title: "سيرفر المشاهدة المباشرة (1080p)",
                url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
            }
        ]
    };
});

serveHTTP(builder.interface, { port: process.env.PORT || 7000 });

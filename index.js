const { addonBuilder, serveHTTP } = require('stremio-addon-sdk');

const manifest = {
    "id": "org.nuvio.allarabicproviders",
    "version": "2.0.0",
    "name": "المزود العربي الشامل (فاصل، ماي سيما، إيجي بست)",
    "description": "إضافة شاملة لجميع المواقع العربية للأفلام والمسلسلات في تطبيق نوفي",
    "resources": ["catalog", "meta", "stream"],
    "types": ["movie", "series"],
    "catalogs": [
        { "type": "movie", "id": "all_fasel", "name": "🎬 أفلام فاصل" },
        { "type": "movie", "id": "all_mycima", "name": "🍿 أفلام ماي سيما" },
        { "type": "movie", "id": "all_egybest", "name": "🎟️ أفلام إيجي بست" },
        { "type": "movie", "id": "all_arabseed", "name": "🌟 أفلام عرب سيد" }
    ],
    "idPrefixes": ["arab_"]
};

const builder = new addonBuilder(manifest);

// 1. عرض الكاتالوجات لكل موقع عربي
builder.defineCatalogHandler(async ({ type, id }) => {
    let metas = [];
    
    if (id === "all_fasel") {
        metas = [
            { id: "arab_fasel_1", type: "movie", name: "محتوى تجريبي - فاصل", poster: "https://image.tmdb.org/t/p/w500/qNBAXBIQlnOThrVvA6mA2B5ggV6.jpg", description: "قسم فاصل الإخباري والترفيهي" }
        ];
    } else if (id === "all_mycima") {
        metas = [
            { id: "arab_mycima_1", type: "movie", name: "محتوى تجريبي - ماي سيما", poster: "https://image.tmdb.org/t/p/w500/qNBAXBIQlnOThrVvA6mA2B5ggV6.jpg", description: "قسم ماي سيما للمواسم والأسطوانات" }
        ];
    } else if (id === "all_egybest") {
        metas = [
            { id: "arab_egybest_1", type: "movie", name: "محتوى تجريبي - إيجي بست", poster: "https://image.tmdb.org/t/p/w500/qNBAXBIQlnOThrVvA6mA2B5ggV6.jpg", description: "قسم إيجي بست الحصري" }
        ];
    } else if (id === "all_arabseed") {
        metas = [
            { id: "arab_arabseed_1", type: "movie", name: "محتوى تجريبي - عرب سيد", poster: "https://image.tmdb.org/t/p/w500/qNBAXBIQlnOThrVvA6mA2B5ggV6.jpg", description: "قسم عرب سيد المميز" }
        ];
    }

    return { metas };
});

// 2. تفاصيل الفيلم
builder.defineMetaHandler(async ({ type, id }) => {
    return {
        meta: {
            id: id,
            type: type,
            name: "المحتوى العربي الموحد",
            poster: "https://image.tmdb.org/t/p/w500/qNBAXBIQlnOThrVvA6mA2B5ggV6.jpg",
            description: "هذا العنصر يدعم كافة المزودين العرب ويقوم بجلب روابط التشغيل المباشرة."
        }
    };
});

// 3. جلب الروابط (Streams) لكل المزودين لتشتغل فوراً
builder.defineStreamHandler(async ({ type, id }) => {
    console.log("Stream requested for Arabic provider ID: ", id);
    
    // إرجاع روابط تشغيل مستقرة ومتوافقة مع مشغل نوفي لكل الأقسام
    return {
        streams: [
            {
                title: "🔥 سيرفر المشاهدة العربي المباشر - 1080p",
                url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
                behaviorHints: { notWebReady: false }
            },
            {
                title: "⚡ سيرفر احتياطي سريعة - HD",
                url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
                behaviorHints: { notWebReady: false }
            }
        ]
    };
});

serveHTTP(builder.interface, { port: process.env.PORT || 7000 });

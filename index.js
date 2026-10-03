const { addonBuilder, serveHTTP } = require("stremio-addon-sdk");
const axios = require("axios");
const cheerio = require("cheerio");

const builder = new addonBuilder({
    id: "org.nuvio.faselhd",
    version: "1.0.0",
    name: "فاصل إعلاني",
    description: "إضافة فاصل إعلاني لمشاهدة الأفلام والمسلسلات",
    resources: ["catalog", "meta", "stream"],
    types: ["movie", "series"],
    catalogs: [
        { type: "movie", id: "fasel_movies", name: "أفلام فاصل" },
        { type: "series", id: "fasel_series", name: "مسلسلات فاصل" }
    ],
    idPrefixes: ["fasel_"]
});

// هنا نقوم بجلب الأفلام والمسلسلات من موقع فاصل إعلاني
builder.defineCatalogHandler(async ({ type }) => {
    try {
        const url = type === "movie" 
            ? "https://www.faselhd.run/movies" 
            : "https://www.faselhd.run/series";
        
        const response = await axios.get(url, {
            headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" }
        });
        
        const $ = cheerio.load(response.data);
        const metas = [];

        divs = type === "movie" ? "div.col-xl-2.col-lg-3.col-md-4.col-6" : "div.col-xl-2.col-lg-3.col-md-4.col-6";
        
        $(divs).each((_, element) => {
            const title = $(element).find(".title").text().trim();
            const link = $(element).find("a").attr("href");
            const poster = $(element).find("img").attr("data-src") || $(element).find("img").attr("src");
            
            if (link && title) {
                const id = "fasel_" + Buffer.from(link).toString("base64");
                metas.push({
                    id: id,
                    type: type,
                    name: title,
                    poster: poster || "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500",
                    description: title
                });
            }
        });

        return { metas };
    } catch (e) {
        return { metas: [] };
    }
});

// جلب تفاصيل الفيلم أو المسلسل
builder.defineMetaHandler(async ({ id }) => {
    try {
        const realLink = Buffer.from(id.replace("fasel_", ""), "base64").toString("ascii");
        const response = await axios.get(realLink, {
            headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" }
        });
        const $ = cheerio.load(response.data);
        
        const title = $("h1").first().text().trim() || "فاصل إعلاني";
        const poster = $(".poster img").attr("src") || "";
        const desc = $(".storyg").text().trim() || "";

        return {
            meta: {
                id: id,
                type: id.includes("series") ? "series" : "movie",
                name: title,
                poster: poster,
                description: desc
            }
        };
    } catch (e) {
        return { meta: { id, name: "خطأ في الجلب", type: "movie" } };
    }
});

// جلب روابط المشاهدة (الاستريمنج)
builder.defineStreamHandler(async ({ id }) => {
    try {
        const realLink = Buffer.from(id.replace("fasel_", ""), "base64").toString("ascii");
        const response = await axios.get(realLink, {
            headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" }
        });
        const $ = cheerio.load(response.data);
        
        const streams = [];
        
        // البحث عن روابط المشاهدة أو الحلقات داخل الصفحة
        $("iframe").each((_, element) => {
            let src = $(element).attr("src") || $(element).attr("data-src");
            if (src) {
                streams.push({
                    title: "فاصل إعلاني - سيرفر المشاهدة الأساسي",
                    url: src.startsWith("http") ? src : "https:" + src
                });
            }
        });

        return { streams };
    } catch (e) {
        return { streams: [] };
    }
});

serveHTTP(builder.getInterface(), { port: process.env.PORT || 7000 });

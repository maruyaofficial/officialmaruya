const CONVRG_MANIFEST_BASE = 'https://officialmaruya.vercel.app/001/2/';
const CONVRG_MANIFEST_SUFFIX = '/manifest.mpd?virtualDomain=001.live_hls.zte.com&IASHttpSessionId=OTT';
const CONVRG_LICENSE_URI = 'https://officialmaruya.vercel.app/widevine/?deviceId=02:00:00:00:00:00';

function generateChannelId(name) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '').substring(0, 20) || `ch${Date.now().toString(36)}`;
}

const defaultChannelList = [


  {
    "name": "ANIMAX",
    "id": "animax",
    "manifest": "https://officialmaruya.vercel.app/api/akamai/grp-07/cg_animax_sd_new.mpd",
    "drm": {
      "type": "clearkey",
      "licenseUrl": "https://officialmaruya.vercel.app/api/license/clearkey?channel=animax"
    },
    "format": "dash"
  },
    {
        name: "CINEMO",
        manifest: 'https://officialmaruya.vercel.app/api/proxy?url=https://cdn-ue1-prod.tsv2.amagi.tv/linear/amg01006-abs-cbn-cinemo-dash-abscbnono/f1da36ea-047e-4262-9e45-9326d0e2930b/index.mpd',
        drm: null,
        format: "dash"
    },

        {
        name: "Cinema One",
        manifest: 'https://officialmaruya.vercel.app/api/proxy?url=https://cdn-ue1-prod.tsv2.amagi.tv/linear/amg01006-abs-cbn-cinemaone-dash-abscbnono/index.mpd',
        drm: null,
        format: "dash"
    },
    {
        name: "Kapamilya HD",
        manifest: 'https://officialmaruya.vercel.app/api/proxy?url=https://cdn-ue1-prod.tsv2.amagi.tv/linear/amg01006-abs-cbn-kapcha-dash-abscbnono/index.mpd',
        drm: null,
        format: "dash"
    },
    {
        name: "ANC",
        manifest: 'https://officialmaruya.vercel.app/api/proxy?url=https://cdn-ue1-prod.tsv2.amagi.tv/linear/amg01006-abs-cbn-anc-global-dash-abscbnono/index.mpd',
        drm: null,
        format: "dash"
    },
    {
        name: "GMA Pinoy TV",
        manifest: 'https://officialmaruya.vercel.app/api/proxy?url=https://cdn-uw2-prod.tsv2.amagi.tv/linear/amg01006-abs-cbn-abscbn-gma-x7-dash-abscbnono/index.mpd',
        drm: null,
        format: "dash"
    },
    {
        name: "Myx",
        manifest: 'https://officialmaruya.vercel.app/api/proxy?url=https://cdn-ue1-prod.tsv2.amagi.tv/linear/amg01006-abs-cbn-myxnola-dash-abscbnono/index.mpd',
        drm: null,
        format: "dash"
    },
    {
        name: "Teleradyo Serbisyo",
        manifest: 'https://officialmaruya.vercel.app/api/proxy?url=https://cdn-ue1-prod.tsv2.amagi.tv/linear/amg01006-abs-cbn-teleradyo-dash-abscbnono/index.mpd',
        drm: null,
        format: "dash"
    },
    {
        name: "TFC",
        manifest: 'https://officialmaruya.vercel.app/api/proxy?url=https://cdn-ue1-prod.tsv2.amagi.tv/linear/amg01006-abs-cbn-tfcasia-dash-abscbnono/index.mpd',
        drm: null,
        format: "dash"
    },
    {
        name: "Arirang",
        manifest: 'https://cdn4.skygo.mn/live/disk1/Arirang/HLSv3-FTA/Arirang.m3u8',
        drm: null,
        format: "hls"
    },
    {
        name: "BBC Earth",
        manifest: 'https://cdn4.skygo.mn/live/disk1/BBC_earth/HLSv3-FTA/BBC_earth.m3u8',
        drm: null,
        format: "hls"
    },
    {
        name: "BBC Lifestyle",
        manifest: 'https://cdn4.skygo.mn/live/disk1/BBC_lifestyle/HLSv3-FTA/BBC_lifestyle.m3u8',
        drm: null,
        format: "hls"
    },
    {
        name: "BBC News",
        manifest: 'https://cdn4.skygo.mn/live/disk1/BBC_News/HLSv3-FTA/BBC_News.m3u8',
        drm: null,
        format: "hls"
    },
    {
        name: "Boomerang",
        manifest: 'https://cdn4.skygo.mn/live/disk1/Boomerang/HLSv3-FTA/Boomerang.m3u8',
        drm: null,
        format: "hls"
    },
    {
        name: "Bloomberg",
        manifest: 'https://cdn4.skygo.mn/live/disk1/Bloomberg/HLSv3-FTA/Bloomberg.m3u8',
        drm: null,
        format: "hls"
    },
    {
        name: "C1",
        manifest: 'https://cdn4.skygo.mn/live/disk1/C1/HLSv3-FTA/C1.m3u8',
        drm: null,
        format: "hls"
    },
    {
        name: "CBeebies",
        manifest: 'https://cdn4.skygo.mn/live/disk1/Cbeebies/HLSv3-FTA/Cbeebies.m3u8',
        drm: null,
        format: "hls"
    },
    {
        name: "Channel 11",
        manifest: 'https://cdn4.skygo.mn/live/disk1/Channel11/HLSv3-FTA/Channel11.m3u8',
        drm: null,
        format: "hls"
    },
    {
        name: "Che",
        manifest: 'https://cdn4.skygo.mn/live/disk1/Che/HLSv3-FTA/Che.m3u8',
        drm: null,
        format: "hls"
    },
    {
        name: "Discovery Asia",
        manifest: 'https://cdn4.skygo.mn/live/disk1/Discovery_Asia/HLSv3-FTA/Discovery_Asia.m3u8',
        drm: null,
        format: "hls"
    },
    {
        name: "Dreambox",
        manifest: 'https://cdn4.skygo.mn/live/disk1/Dreambox/HLSv3-FTA/Dreambox.m3u8',
        drm: null,
        format: "hls"
    },
    {
        name: "Eagle",
        manifest: 'https://cdn4.skygo.mn/live/disk1/Eagle/HLSv3-FTA/Eagle.m3u8',
        drm: null,
        format: "hls"
    },
    {
        name: "Education",
        manifest: 'https://cdn4.skygo.mn/live/disk1/Education/HLSv3-FTA/Education.m3u8',
        drm: null,
        format: "hls"
    },
    {
        name: "ETV",
        manifest: 'https://cdn4.skygo.mn/live/disk1/ETV/HLSv3-FTA/ETV.m3u8',
        drm: null,
        format: "hls"
    },
    // ... Add the remaining channels using the same format ...
].map(channel => {
    if (!channel.name || channel.name.trim() === "") {
        channel.name = "Unnamed Channel";
    }

    if (!channel.id) {
        channel.id = generateChannelId(channel.name);
    }

    // Proxy PLDT logic
    if (channel.manifest?.includes('qp-pldt-live-grp')) {
        try {
            const url = new URL(channel.manifest);
            const match = url.hostname.match(/grp-\d+/);
            if (match) {
                const groupName = match[0];
                const manifestName = url.pathname.split('/').pop();
                channel.manifest = `https://officialmaruya.vercel.app/api/akamai/${groupName}/${manifestName}`;
            }
        } catch (e) {
            console.error("Failed to parse PLDT manifest URL:", channel.manifest, e);
        }
    }

    if (!channel.drm) channel.drm = null;
    if (!channel.image) channel.image = null;
    if (!channel.format) channel.format = "auto";

    return channel;
});

export { defaultChannelList, generateChannelId };

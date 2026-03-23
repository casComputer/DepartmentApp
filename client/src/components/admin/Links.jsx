import { View, Text, Pressable, Linking } from "react-native";

const links = [
{
title: "UptimeRobot",
url: "https://stats.uptimerobot.com/AViOgg4MGo/802350630",
description: "Monitor server & API uptime status",
icon: "📡",
},
{
title: "Render",
url: "https://dashboard.render.com/",
description: "Primary backend hosting",
icon: "⚙️",
badge: "Primary",
},
{
title: "Vercel",
url: "https://vercel.com/casdepartmentcomputer-5781s-projects",
description: "Fallback backend hosting",
icon: "⚙️️",
badge: "Fallback",
},
{
title: "Expo",
url: "https://expo.dev/accounts/cascomputerdepartment",
description: "Mobile app builds & OTA updates",
icon: "📱",
},
{
title: "Turso",
url: "https://app.turso.tech/cascomputer/databases/database/data",
description: "Edge SQLite database — browse & query data",
icon: "🗄️",
},
{
title: "MongoDB Atlas",
url: "https://cloud.mongodb.com",
description: "Cloud NoSQL database management",
icon: "🍃",
},
{
title: "GitHub",
url: "https://github.com/casComputer/",
description: "Source code repositories",
icon: "🐙",
},
];

const badgeStyle = {
Primary: "bg-btn/15 text-btn",
Fallback: "bg-text-secondary/15 text-text-secondary",
};

const LinkItem = ({ item }) => (
<Pressable
    onPress={() => Linking.openURL(item.url)}
    className="flex-row items-center gap-3 px-4 py-3.5 rounded-xl bg-primary border border-border active:bg-card-selected"
    >
    <Text className="text-xl w-8 text-center">{item.icon}</Text>

    <View className="flex-1">
      <View className="flex-row items-center gap-2 mb-0.5">
        <Text className="text-text font-semibold text-sm">{item.title}</Text>
        {item.badge && (
        <View className={`px-2 py-0.5 rounded-full ${badgeStyle[item.badge]}`}>
            <Text className={`text-xs font-semibold ${badgeStyle[item.badge]}`}>
              {item.badge}
            </Text>
          </View>
        )}
      </View>
      <Text className="text-text-secondary text-xs" numberOfLines={1}>
        {item.description}
      </Text>
    </View>

    <Text className="text-text-secondary/40 text-base">›</Text>
  </Pressable>
);

const AdminLinks = () => (
<View className="bg-card rounded-2xl p-4 gap-2 mt-5">
    {/* Header */}
    <View className="mb-2">
      <Text className="text-text font-bold text-base">Admin Links</Text>
      <Text className="text-text-secondary text-xs mt-0.5">
        Quick access to dashboards & services
      </Text>
    </View>

    {/* Divider */}
    <View className="h-px bg-border mb-1" />

    {/* Links */}
    {links.map((item) => (
    <LinkItem key={item.title} item={item} />
    ))}
  </View>
);

export default AdminLinks;
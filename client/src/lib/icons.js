import * as Icons from "@expo/vector-icons";
import { withUniwind } from "uniwind";

const styled = {};

for (const key in Icons) {
    const IconComponent = Icons[key];
    const Wrapped = withUniwind(IconComponent);

    styled[key] = props => {
        const { className, ...rest } = props;
        return <Wrapped {...rest} className="text-text" />;
    };

}

export const {
    AntDesign,
    Entypo,
    EvilIcons,
    Feather,
    FontAwesome,
    FontAwesome5,
    FontAwesome6,
    Fontisto,
    Foundation,
    Ionicons,
    MaterialCommunityIcons,
    MaterialIcons,
    Octicons,
    SimpleLineIcons,
    Zocial
} = styled;

export default styled;

import { Text, useColorScheme, View } from "react-native";
import { avatarColors, avatarInitial } from "@/lib/avatar";

type Props = {
  title: string;
  size?: number;
};

export function Avatar({ title, size = 44 }: Props) {
  const scheme = useColorScheme();
  const { bg, fg } = avatarColors(title, scheme);
  return (
    <View
      style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: bg }}
      className="items-center justify-center"
    >
      <Text style={{ color: fg, fontSize: size * 0.42, fontWeight: "600" }}>
        {avatarInitial(title)}
      </Text>
    </View>
  );
}

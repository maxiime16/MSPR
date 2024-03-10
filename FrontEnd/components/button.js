import { StyleSheet, View, Pressable, Text } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";

export default function ButtonEdit({
  label,
  theme,
  onPress,
  icon,
  size = 20,
  color = "#A3D288",
  disabled = false,
  border = 2,
}) {
  if (theme === "primary-icon") {
    return (
      <View
        style={[
          styles.buttonContainer,
          { borderWidth: 2, borderColor: "#A3D288" },
        ]}
      >
        <Pressable
          style={[styles.button, { backgroundColor: "#FFFFFF00" }]}
          onPress={onPress}
          disabled={disabled}
        >
          <AntDesign
            name={icon}
            size={size}
            color={color}
            style={styles.buttonIcon}
          />
          <Text style={[styles.buttonLabel, { color: "#A3D288" }]}>
            {label}
          </Text>
        </Pressable>
      </View>
    );
  } else if (theme === "primary-full") {
    return (
      <View
        style={[
          styles.buttonContainer,
          { borderWidth: 2, borderColor: "#A3D288" },
        ]}
      >
        <Pressable
          style={[styles.button, { backgroundColor: "#A3D288" }]}
          onPress={onPress}
          disabled={disabled}
        >
          <Text style={[styles.buttonLabel, { color: "white" }]}>{label}</Text>
        </Pressable>
      </View>
    );
  } else if (theme === "primary-full-little") {
    return (
      <View
        style={[
          styles.buttonContainer,
          { borderWidth: border, borderColor: "#A3D288" },
        ]}
      >
        <Pressable
          style={[styles.buttonLittle, { backgroundColor: "#A3D288" }]}
          onPress={onPress}
          disabled={disabled}
        >
          <Text style={[styles.buttonLabel, { color: "white" }]}>{label}</Text>
        </Pressable>
      </View>
    );
  } else if (theme === "primary-border") {
    return (
      <View
        style={[
          styles.buttonContainer,
          { borderWidth: border, borderColor: "#A3D288" },
        ]}
      >
        <Pressable
          style={[styles.button]}
          onPress={onPress}
          disabled={disabled}
        >
          <Text style={[styles.buttonLabel, { color: "#A3D288" }]}>
            {label}
          </Text>
        </Pressable>
      </View>
    );
  } else if (theme === "primary-border-small") {
    return (
      <View
        style={[
          styles.buttonContainerSmall,
          { borderWidth: border, borderColor: "#A3D288" },
        ]}
      >
        <Pressable
          style={[styles.button]}
          onPress={onPress}
          disabled={disabled}
        >
          <Text style={[styles.buttonLabel, { color: "#A3D288" }]}>
            {label}
          </Text>
        </Pressable>
      </View>
    );
  } else if (theme === "just-icon") {
    return (
      <View
        style={[
          styles.buttonContainerJustIcon,
          { borderWidth: border, borderColor: color },
        ]}
      >
        <Pressable onPress={onPress} disabled={disabled}>
          <AntDesign name={icon} size={size} color={color} />
        </Pressable>
      </View>
    );
  } else if (theme === "little") {
    return (
      <View
        style={[
          styles.buttonContainerLittle,
          { borderWidth: border, borderColor: color, borderRadius: 18 },
        ]}
      >
        <Pressable
          style={[styles.buttonLittle, { backgroundColor: "#FFFFFF00" }]}
          onPress={onPress}
          disabled={disabled}
        >
          <AntDesign
            name={icon}
            size={size}
            color={color}
            style={styles.buttonIconLittle}
          />
          <Text style={[styles.buttonLabelLittle, { color: "#000000" }]}>
            {label}
          </Text>
        </Pressable>
      </View>
    );
  } else {
    return (
      <View style={styles.buttonContainer}>
        <Pressable style={styles.button} onPress={onPress}>
          <Text style={styles.buttonLabel}>{label}</Text>
        </Pressable>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  buttonContainer: {
    borderRadius: 7,
    width: 200,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonContainerJustIcon: {
    borderRadius: 7,
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonContainerLittle: {
    width: 80,
    height: 80,
    alignItems: "center",
    justifyContent: "center",
    padding: 3,
  },
  buttonContainerSmall: {
    width: 90,
    height: 35,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 7,
  },
  button: {
    borderRadius: 5,
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  buttonLittle: {
    borderRadius: 5,
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
  buttonIcon: {
    paddingRight: 8,
  },
  buttonLabel: {
    color: "#fff",
    fontSize: 16,
  },
});

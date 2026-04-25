import { FadeIn, FadeOut, SlideInDown, SlideOutDown } from "react-native-reanimated";
import { animation } from "./theme";

export const fadeIn = FadeIn.duration(animation.duration.base);
export const fadeOut = FadeOut.duration(animation.duration.fast);
export const slideUp = SlideInDown.duration(animation.duration.slow).springify().damping(animation.spring.damping);
export const slideDown = SlideOutDown.duration(animation.duration.base);

import React, {
    useCallback,
    useEffect,
    useRef
} from 'react';
import {
    Dimensions,
    Platform,
    Pressable,
    Text,
    View
} from 'react-native';
import Animated, {
    Easing,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from 'react-native-reanimated';
import {
    Gesture,
    GestureDetector
} from 'react-native-gesture-handler';
import {
    useSafeAreaInsets
} from 'react-native-safe-area-context';
import Svg, {
    Circle,
    Line,
    Path,
    Polyline
} from 'react-native-svg';
import {
    useToastStore
} from '@store/app.store.js';

const {
    width: SCREEN_WIDTH
} = Dimensions.get('window');
const TOAST_DURATION = 4000;
const SWIPE_THRESHOLD = 72;

const TYPE_CONFIG = {
    success: {
        accent: '#22c55e'
    },
    error: {
        accent: '#ef4444'
    },
    warning: {
        accent: '#f59e0b'
    },
    info: {
        accent: '#60a5fa'
    },
    default: {
        accent: '#a78bfa'
    },
    };

    function IconSuccess( {
        color
    }) {
        return (
            <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" />
                <Polyline points="9,12 11,14 15,10" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
        );
    }

    function IconError( {
        color
    }) {
        return (
            <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" />
                <Line x1="15" y1="9" x2="9" y2="15" stroke={color} strokeWidth="2" strokeLinecap="round" />
                <Line x1="9" y1="9" x2="15" y2="15" stroke={color} strokeWidth="2" strokeLinecap="round" />
            </Svg>
        );
    }

    function IconWarning( {
        color
    }) {
        return (
            <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                <Path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <Line x1="12" y1="9" x2="12" y2="13" stroke={color} strokeWidth="2" strokeLinecap="round" />
                <Line x1="12" y1="17" x2="12.01" y2="17" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
            </Svg>
        );
    }

    function IconInfo( {
        color
    }) {
        return (
            <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" />
                <Line x1="12" y1="8" x2="12" y2="8.01" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
                <Line x1="12" y1="12" x2="12" y2="16" stroke={color} strokeWidth="2" strokeLinecap="round" />
            </Svg>
        );
    }

    function IconClose() {
        return (
            <Svg width={12} height={12} viewBox="0 0 24 24" fill="none">
                <Line x1="18" y1="6" x2="6" y2="18" stroke="#9ca3af" strokeWidth="2.5" strokeLinecap="round" />
                <Line x1="6" y1="6" x2="18" y2="18" stroke="#9ca3af" strokeWidth="2.5" strokeLinecap="round" />
            </Svg>
        );
    }

    const ICON_MAP = {
        success: IconSuccess,
        error: IconError,
        warning: IconWarning,
        info: IconInfo,
    default: IconInfo,
    };

    function ToastItem( {
        item, onDismiss, isBottom
    }) {
        const translateX = useSharedValue(0);
        const translateY = useSharedValue(isBottom ? 16: -16);
        const opacity = useSharedValue(0);
        const progress = useSharedValue(1);
        const dismissed = useRef(false);

        const {
            accent
        } = TYPE_CONFIG[item.type] ?? TYPE_CONFIG.default;
        const Icon = ICON_MAP[item.type] ?? ICON_MAP.default;

        const triggerDismiss = useCallback(() => {
            if (dismissed.current) return;
            dismissed.current = true;
            opacity.value = withTiming(0, {
                duration: 180
            });
            translateY.value = withTiming(isBottom ? 12: -12, {
                duration: 200
            }, (done) => {
                if (done) runOnJS(onDismiss)(item.id);
            });
        }, [item.id, onDismiss, isBottom]);

        useEffect(() => {
            opacity.value = withTiming(1,
                {
                    duration: 220,
                    easing: Easing.out(Easing.quad)
                });
            translateY.value = withSpring(0,
                {
                    damping: 22,
                    stiffness: 220
                });
            progress.value = withTiming(0,
                {
                    duration: TOAST_DURATION,
                    easing: Easing.linear
                });
            const timer = setTimeout(triggerDismiss,
                TOAST_DURATION);
            return () => clearTimeout(timer);
        }, []);

        const panGesture = Gesture.Pan()
        .activeOffsetX(10)
        .failOffsetY([-8, 8])
        .onUpdate((e) => {
            if (e.translationX > 0) {
                translateX.value = e.translationX;
                opacity.value = Math.max(0, 1 - e.translationX / (SCREEN_WIDTH * 0.55));
            }
        })
        .onEnd((e) => {
            if (e.translationX > SWIPE_THRESHOLD || e.velocityX > 600) {
                translateX.value = withTiming(SCREEN_WIDTH, {
                    duration: 220
                });
                opacity.value = withTiming(0, {
                    duration: 180
                }, (done) => {
                    if (done) runOnJS(onDismiss)(item.id);
                });
            } else {
                translateX.value = withSpring(0, {
                    damping: 20, stiffness: 240
                });
                opacity.value = withTiming(1, {
                    duration: 140
                });
            }
        });

        const containerStyle = useAnimatedStyle(() => ({
            opacity: opacity.value,
            transform: [{
                translateX: translateX.value
            }, {
                translateY: translateY.value
            }],
        }));

        const progressStyle = useAnimatedStyle(() => ({
            width: `${progress.value * 100}%`,
        }));

        return (
            <GestureDetector gesture={panGesture}>
                <Animated.View
                    style={[containerStyle,
                        { marginHorizontal: 12,
                            marginBottom: 8 }]}
                    className="rounded-2xl bg-card border border-border overflow-hidden"
                    >
                    {/* Coloured left rail */}
                    <View
                        style={ {
                            position: 'absolute',
                            left: 0,
                            height: '70%',
                            top: '15%',
                            bottom: 0,
                            width: 3,
                            backgroundColor: accent,
                            borderTopLeftRadius: 16,
                            borderBottomLeftRadius: 16,
                        }}
                        />

                    {/* Content */}
                    <View className="flex-row items-start px-4 py-3" style={ { paddingLeft: 18 }}>
                        <View className="mt-0.5 mr-3">
                            <Icon color={accent} />
                        </View>
                        <View className="flex-1 pr-2">
                            {!!item.title && (
                                <Text className="text-text text-sm font-semibold mb-0.5" numberOfLines={1}>
                                    {item.title}
                                </Text>
                            )}
                            {!!item.message && (
                                <Text className="text-text-secondary text-xs leading-5" numberOfLines={2}>
                                    {item.message}
                                </Text>
                            )}
                        </View>
                        <Pressable onPress={triggerDismiss} hitSlop={10} className="p-1 -mr-1 mt-0.5 rounded-md active:bg-btn">
                            <IconClose />
                        </Pressable>
                    </View>

                    {/* Progress rail */}
                    <View className="h-0.5 bg-border">
                        <Animated.View style={[progressStyle,
                            { height: '100%',
                                backgroundColor: accent,
                                opacity: 0.7 }]} />
                    </View>
                </Animated.View>
            </GestureDetector>
        );
    }

    export default function ToastManager( {
        position = 'bottom'
    }) {
        const toasts = useToastStore((s) => s.toasts);
        const remove = useToastStore((s) => s._remove);
        const insets = useSafeAreaInsets();
        const isBottom = position !== 'top';

        const edgeOffset = isBottom
        ? insets.bottom + (Platform.OS === 'android' ? 12: 8): insets.top + (Platform.OS === 'android' ? 8: 4);

        const renderList = isBottom ? [...toasts].reverse(): toasts;

        return (
            <View
                style={ {
                    position: 'absolute',
                    ...(isBottom ? { bottom: edgeOffset }: { top: edgeOffset }),
                    left: 0,
                    right: 0,
                    zIndex: 9999,
                    pointerEvents: 'box-none',
                }}
                >
                {renderList.map((t) => (
                    <ToastItem key={t.id} item={t} onDismiss={remove} isBottom={isBottom} />
                ))}
            </View>
        );
    }
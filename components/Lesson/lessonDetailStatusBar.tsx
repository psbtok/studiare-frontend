import { Lesson, Profile } from "@/models/models";
import { View, Text, StyleSheet, Alert } from "react-native";
import Button from "../General/Interactive/Button";
import words from "@/locales/ru";
import { updateLessonStatusService } from "@/services/lessonService"; 
import React, { useState } from 'react';
import { Colors } from "@/styles/Colors";
import commonStyles from "@/styles/CommonStyles";
import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

function LessonDetailStatusBar(props: { lesson: Lesson, profile: Profile }) {
    const { profile } = props;
    const [lesson, setLesson] = useState(props.lesson);  
    const isTutor = lesson.tutor?.tutor && profile?.tutor?.id && profile.tutor.id === lesson.tutor.tutor.id;

    const router = useRouter();
    
    let status: 'canceled' | 'conducted' | 'confirmed' | 'awaitingConfirmation';
    if (lesson.isCancelled) {
        status = 'canceled';
    } else if (lesson.isConducted) {
        status = 'conducted';
    } else if (lesson.isConfirmed) {
        status = 'confirmed';
    } else {
        status = 'awaitingConfirmation';
    }

    const handleAction = (action: 'cancel' | 'confirm' | 'conduct') => {
        let confirmationMessage = '';
        switch (action) {
            case 'cancel':
                confirmationMessage = words.confirmCancelLesson;
                break;
            case 'confirm':
                confirmationMessage = words.confirmLesson;
                break;
            case 'conduct':
                confirmationMessage = words.confirmConductLesson;
                break;
        }
    
        Alert.alert(
            words.confirmationTitle,
            confirmationMessage,
            [
                { text: words.no, style: "cancel" },
                {
                    text: words.yes,
                    onPress: async () => {
                        try {
                            const updatedLesson = await updateLessonStatusService(lesson, action);
                            setLesson(updatedLesson);
                            Alert.alert(words.success, words.lessonUpdated);
                        } catch (error: any) {
                            Alert.alert(words.error, error.message);
                        }
                    }
                }
            ]
        );
    };

    const handleEdit = () => {
        const serializedLesson = encodeURIComponent(JSON.stringify(lesson));
        router.push(`/lesson/lessonEdit?lesson=${serializedLesson}`);
    };

    const getAvailableActions = () => {
        switch (status) {
            case 'canceled':
                return (
                    <View style={[styles.actionBlock, styles.actionLabel]}>
                        <AntDesign style={styles.icon} name="closecircleo" size={22} color={Colors.deepGrey} />
                        <Text style={commonStyles.label}>{words.lessonCanceled}</Text>
                    </View>
                )
            case 'conducted':
                return (
                    <View style={[styles.actionBlock, styles.actionLabel]}>
                        <MaterialIcons style={[styles.icon, styles.paidIcon]} name="paid" size={28} color={Colors.deepGrey} />
                        <Text style={commonStyles.label}>{words.lessonConducted}</Text>
                    </View>
                )
            case 'confirmed':
                if (isTutor) {
                    return (
                        <View>
                            <View style={[styles.actionBlock, styles.actionLabel]}>
                                <Text style={commonStyles.label}>{words.clientConfrimedLesson}</Text>
                            </View>
                            <View style={styles.actionBlock}>
                                <View style={styles.buttonSmall}>
                                    <Button label={words.reject} onPress={() => handleAction('cancel')} />
                                </View>
                                <View style={styles.buttonBig}>
                                    <Button theme="primary" label={words.isConducted} onPress={() => handleAction('conduct')} />
                                </View>
                            </View>
                        </View>
                    );
                } else {
                    return (
                        <View>
                            <View style={[styles.actionBlock, styles.actionLabel]}>
                                <Text style={commonStyles.label}>{words.youConfrimedLesson}</Text>
                            </View>
                            <View style={styles.actionBlock}>
                                <View style={styles.buttonSmall}>
                                    <Button label={words.reject} onPress={() => handleAction('cancel')} />
                                </View>
                            </View>
                        </View>
                    )
                }
            case 'awaitingConfirmation':
                if (isTutor) {
                    return (
                        <View>
                            <View style={[styles.actionBlock, styles.actionLabel]}>
                                <Ionicons style={styles.icon}  name="time" size={24} color={Colors.deepGrey} />
                                <Text style={commonStyles.label}>
                                    {words.awaitingClientConfirmation}
                                </Text>
                            </View>
                            <View style={styles.actionBlock}>
                                <View style={styles.buttonSmall}>
                                    <Button label={words.reject} onPress={() => handleAction('cancel')} />
                                </View>
                                <View style={styles.buttonBig}>
                                    <Button theme="primary" label={words.edit} onPress={() => handleEdit()} />
                                </View>
                            </View>
                        </View>
                    )
                }
                else {
                    return (
                        <View>
                            <View style={[styles.actionBlock, styles.actionLabel]}>
                                <Text style={commonStyles.label}>{words.youNeedToConfirmLesson}</Text>
                            </View>
                            <View style={styles.actionBlock}>
                                <View style={styles.buttonSmall}>
                                    <Button label={words.reject} onPress={() => handleAction('cancel')} />
                                </View>
                                <View style={styles.buttonBig}>
                                    <Button theme="primary" label={words.confirm} onPress={() => handleAction('confirm')} />
                                </View>
                            </View>
                        </View>
                    );
                }
            default:
                return null;
        }
    };

    return <View>{getAvailableActions()}</View>;
}

const styles = StyleSheet.create({
    actionBlock: {
        flexDirection: 'row',
        marginBottom: 12,
        backgroundColor: Colors.lightGrey,
        padding: 16,
        paddingHorizontal: 16,
        borderRadius: 24,
        flexWrap: 'wrap',
    },
    actionLabel: {
        paddingHorizontal: 24,
        paddingBottom: 10,
    },
    buttonSmall: {
        flex: 1
    },
    buttonBig: {
        marginLeft: 16,
        flex: 1.5
    },
    icon: {
        paddingTop: 4,
        marginRight: 8,
    },
    paidIcon: {
        paddingTop: 1
    }
});

export default LessonDetailStatusBar;

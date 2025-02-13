import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import Button from "../General/Interactive/Button";
import words from "@/locales/ru";
import { Colors } from "@/styles/Colors";
import { Lesson, Profile } from "@/models/models";
import { updateLessonStatusService } from "@/services/lessonService"; 
import { useRouter } from "expo-router";

interface LessonDetailActionsProps {
    lesson: Lesson;
    profile: Profile;
    setLesson: (lesson: Lesson) => void;
}

function LessonDetailActions({ lesson, profile, setLesson }: LessonDetailActionsProps) {
    const router = useRouter();

    const currentParticipant = lesson.participants.find(
        (participant) => participant.profile.user.id === profile.user.id
    );
    const status = currentParticipant?.status || 'awaiting_confirmation';

    const isTutor = lesson.tutor?.tutor && profile?.tutor?.id && profile.tutor.id === lesson.tutor.tutor.id;
    const editingUnavailable = lesson.participants.some(
        (participant) => ['conducted', 'confirmed', 'cancelled'].includes(participant.status)
    );

    const lessonStartTime = new Date(lesson.date_start);
    const currentTime = new Date();
    const utcCurrentTime = new Date(currentTime.getTime() + currentTime.getTimezoneOffset() * 60 * 1000);
    const utcLessonStartTime = new Date(lessonStartTime.getTime() + lessonStartTime.getTimezoneOffset() * 60 * 1000);
    const threeHoursInMs = 3 * 60 * 60 * 1000;
    const startsSoon = utcLessonStartTime.getTime() - utcCurrentTime.getTime() < threeHoursInMs;

    const handleAction = (action: 'cancel' | 'confirm' | 'conduct') => {
        let confirmationMessage = '';
        switch (action) {
            case 'cancel':
                if (startsSoon && !isTutor) {
                    confirmationMessage = words.confirmCancelLessonWithFee;
                } else {                    
                    confirmationMessage = words.confirmCancelLesson;
                }
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

    switch (status) {
        case 'cancelled':
            return null; // No buttons for cancelled status
        case 'conducted':
            return null; // No buttons for conducted status
        case 'confirmed':
            if (isTutor) {
                return (
                    <View style={styles.actionBlock}>
                        <View style={styles.buttonSmall}>
                            <Button label={words.reject} onPress={() => handleAction('cancel')} />
                        </View>
                        <View style={styles.buttonBig}>
                            <Button theme="primary" label={words.isConducted} onPress={() => handleAction('conduct')} />
                        </View>
                    </View>
                );
            } else {
                return (
                    <View style={styles.actionBlock}>
                        <View style={styles.buttonSmall}>
                            <Button label={words.reject} onPress={() => handleAction('cancel')} />
                        </View>
                    </View>
                );
            }
        case 'awaiting_confirmation':
            if (isTutor) {
                return (
                    <View style={styles.actionBlock}>
                        <View style={styles.buttonSmall}>
                            <Button label={words.reject} onPress={() => handleAction('cancel')} />
                        </View>
                        {!startsSoon && !editingUnavailable && (
                            <View style={styles.buttonBig}>
                                <Button theme="primary" label={words.edit} onPress={() => handleEdit()} />
                            </View>
                        )}
                    </View>
                );
            } else {
                return (
                    <View style={styles.actionBlock}>
                        <View style={styles.buttonSmall}>
                            <Button label={words.reject} onPress={() => handleAction('cancel')} />
                        </View>
                        <View style={styles.buttonBig}>
                            <Button theme="primary" label={words.confirm} onPress={() => handleAction('confirm')} />
                        </View>
                    </View>
                );
            }
        default:
            return null;
    }
}

const styles = StyleSheet.create({
    actionBlock: {
        flexDirection: 'row',
        backgroundColor: Colors.lightGrey,
        padding: 16,
        paddingHorizontal: 16,
        borderRadius: 24,
        flexWrap: 'wrap',
    },
    buttonSmall: {
        flex: 1,
    },
    buttonBig: {
        marginLeft: 16,
        flex: 1.5,
    },
});

export default LessonDetailActions;
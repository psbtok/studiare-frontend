import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import Button from "../General/Interactive/Button";
import words from "@/locales/ru";
import { Colors } from "@/styles/Colors";
import { Lesson, Profile } from "@/models/models";
import { updateLessonStatusService } from "@/services/lessonService"; 
import { useRouter } from "expo-router";
import LessonRateModal from './lessonRateModal';

interface LessonDetailActionsProps {
    lesson: Lesson;
    profile: Profile;
    setLesson: (lesson: Lesson) => void;
}

function LessonDetailActions({ lesson, profile, setLesson }: LessonDetailActionsProps) {
    const [modalVisible, setModalVisible] = useState(false);
    const [status, setStatus] = useState('awaiting_confirmation');
    const [rated, setRated] = useState(false);
    const currentParticipant = lesson.participants.find(
        (participant) => participant.profile.user.id === profile.user.id
    );

    useEffect(() => {
        if (currentParticipant) {
            setRated(!!currentParticipant.rating);
        }
    }, [currentParticipant]);

    useEffect(() => {
        if (currentParticipant && lesson.participants.length === 1) {
            setStatus(currentParticipant.status);
        } else {
            if (lesson.participants.every(selected => selected.status === "cancelled")) {
                setStatus('cancelled');
            } else if (lesson.participants.every(selected => ["cancelled", "conducted"].includes(selected.status))) {
                setStatus('conducted');
            } else if (lesson.participants.some(selected => selected.status === "confirmed")) {
                setStatus('confirmed');
            }
        }
    }, [currentParticipant, lesson.participants]);

    const isTutor = lesson.tutor?.tutor && profile?.tutor?.id && profile.tutor.id === lesson.tutor.tutor.id;

    const lessonStartTime = new Date(lesson.date_start);
    const currentTime = new Date();
    const utcCurrentTime = new Date(currentTime.getTime() + currentTime.getTimezoneOffset() * 60 * 1000);
    const utcLessonStartTime = new Date(lessonStartTime.getTime() + lessonStartTime.getTimezoneOffset() * 60 * 1000);
    const threeHoursInMs = 3 * 60 * 60 * 1000;
    const startsSoon = utcLessonStartTime.getTime() - utcCurrentTime.getTime() < threeHoursInMs;
    const router = useRouter()
    
    const handleAction = (action: 'cancel' | 'confirm' | 'conduct') => {
        let confirmationMessage = '';
        switch (action) {
            case 'cancel':
                confirmationMessage = startsSoon && !isTutor ? words.confirmCancelLessonWithFee : words.confirmCancelLesson;
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

    const rateLesson = () => {
        setModalVisible(true);
    }
    
    const handleRate = (rating: number) => {
        setRated(true);

        const updatedLesson = {
            ...lesson,
            participants: lesson.participants.map(participant =>
                participant.profile.user.id === currentParticipant.profile.user.id
                    ? { ...participant, rating } 
                    : participant
            ),
        };

        setLesson(updatedLesson);
    };

    const handleEdit = () => {
        const serializedLesson = encodeURIComponent(JSON.stringify(lesson));
        router.push(`/lesson/lessonEdit?lesson=${serializedLesson}`);
    };

    switch (status) {
        case 'confirmed':
            return (
                <View style={styles.actionBlock}>
                    <View style={styles.buttonSmall}>
                        <Button label={words.reject} onPress={() => handleAction('cancel')} />
                    </View>
                    {isTutor ? (
                        <View style={styles.buttonBig}>
                            <Button theme="primary" label={words.isConducted} onPress={() => handleAction('conduct')} />
                        </View>
                    ) : null}
                </View>
            );
        case 'awaiting_confirmation':
            if (isTutor) {
                return (
                    <View style={styles.actionBlock}>
                        <View style={styles.buttonSmall}>
                            <Button label={words.reject} onPress={() => handleAction('cancel')} />
                        </View>
                        {!startsSoon && <View style={styles.buttonBig}>
                            <Button theme="primary" label={words.edit} onPress={() => handleEdit()} />
                        </View>}
                    </View>
                );
            } else {
                return (
                    <View style={styles.actionBlock}>
                        <View style={styles.buttonSmall}>
                            <Button label={words.reject} onPress={() => handleAction('cancel')} />
                        </View>
                        {isTutor && (
                            <View style={styles.buttonBig}>
                                <Button theme="primary" label={words.confirm} onPress={() => handleAction('confirm')} />
                            </View>
                        )}
                    </View>
                );
            }
        case 'conducted':
            return (
                <View>
                    {!isTutor && !rated && (<View style={styles.actionBlock}>
                        <View style={styles.buttonSmall}>
                            <Button theme="primary" label={words.rateLesson} onPress={rateLesson} />
                        </View>
                        <LessonRateModal 
                            visible={modalVisible} 
                            onClose={() => setModalVisible(false)} 
                            lessonId={lesson.id}
                            onRate={handleRate}
                            />
                    </View>)}
                </View>
            );
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

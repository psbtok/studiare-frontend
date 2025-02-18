import { Lesson, Profile } from "@/models/models";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import words from "@/locales/ru";
import { Colors } from "@/styles/Colors";
import commonStyles from "@/styles/CommonStyles";
import AntDesign from '@expo/vector-icons/AntDesign';
import React, { useState, useEffect } from 'react';
import LessonParticipantStatusList from "./lessonParticipantStatusList";

function LessonDetailStatusBar(props: { lesson: Lesson, profile: Profile }) {
    const { profile } = props;
    const lesson = props.lesson;
    const [startsSoon, setStartsSoon] = useState(false); 
    const lessonStartTime = new Date(lesson.date_start);
    const isTutor = lesson.tutor?.tutor && profile?.tutor?.id && profile.tutor.id === lesson.tutor.tutor.id;
    const [status, setStatus] = useState('awaiting_confirmation')

    const currentParticipant = lesson.participants.find(
        (participant) => participant.profile.user.id === profile.user.id
    );

    useEffect(() => {
        if (currentParticipant && lesson.participants.length === 1) {
            setStatus(currentParticipant.status);
        } else {
            if (lesson.participants.every(selected => selected.status === "cancelled")) {
                setStatus('canceled');
            } else if (lesson.participants.every(selected => ["cancelled", "conducted"].includes(selected.status))) {
                setStatus('conducted');
            } else if (lesson.participants.some(selected => selected.status === "confirmed")) {
                setStatus('confirmed');
            }
        }

    }, [currentParticipant, lesson.participants]);


    const checkStartsSoon = () => {
        const currentTime = new Date(); 
        const utcCurrentTime = new Date(currentTime.getTime() + currentTime.getTimezoneOffset() * 60 * 1000); 
        const utcLessonStartTime = new Date(lessonStartTime.getTime() + lessonStartTime.getTimezoneOffset() * 60 * 1000); 
        const threeHoursInMs = 3 * 60 * 60 * 1000; 
        const timeDifference = utcLessonStartTime.getTime() - utcCurrentTime.getTime();
        setStartsSoon(timeDifference < threeHoursInMs); 
    };

    useEffect(() => {
        checkStartsSoon();
        const intervalId = setInterval(() => {
            checkStartsSoon();
        }, 10000);
        return () => clearInterval(intervalId);
    }, [lesson]);
    return (
        <View style={styles.container}>
            <ScrollView>
                {
                    startsSoon &&
                    ['awaiting_confirmation', 'confirmed'].includes(status) &&
                    (
                    <View style={[styles.actionBlock, styles.actionLabel]}>
                        <AntDesign style={styles.icon} name="clockcircle" size={22} color={Colors.deepGrey} />
                        <Text style={commonStyles.label}>
                            {words.lessonStartsSoon}
                        </Text>
                    </View>
                )}
                {status === 'cancelled' && (
                    <View style={[styles.actionBlock, styles.actionLabel]}>
                        <AntDesign style={styles.icon} name="closecircle" size={22} color={Colors.deepGrey} />
                        <Text style={commonStyles.label}>{words.lessonCancelled}</Text>
                    </View>
                )}
                {status === 'conducted' && (
                    <View style={[styles.actionBlock, styles.actionLabel]}>
                        <AntDesign style={styles.icon} name="checkcircle" size={22} color={Colors.deepGrey} />
                        <Text style={commonStyles.label}>{words.lessonConducted}</Text>
                    </View>
                )}
                {status === 'confirmed' && isTutor && lesson.participants.length == 1 && (
                    <View style={[styles.actionBlock, styles.actionLabel]}>
                        <Text style={commonStyles.label}>{words.clientConfrimedLesson}</Text>
                    </View>
                )}
                {status === 'confirmed' && !isTutor && (
                    <View style={[styles.actionBlock, styles.actionLabel]}>
                        <Text style={commonStyles.label}>{words.youConfrimedLesson}</Text>
                    </View>
                )}
                {status === 'awaiting_confirmation' && isTutor && lesson.participants.length == 1 && (
                    <View style={[styles.actionBlock, styles.actionLabel]}>
                        <AntDesign style={styles.icon} name="clockcircleo" size={22} color={Colors.deepGrey} />
                        <Text style={commonStyles.label}>
                            {words.awaitingClientConfirmation}
                        </Text>
                    </View>
                )}
                {status === 'awaiting_confirmation' && !isTutor && (
                    <View style={[styles.actionBlock, styles.actionLabel]}>
                        <Text style={commonStyles.label}>{words.youNeedToConfirmLesson}</Text>
                    </View>
                )}
                {lesson.participants.length > 1 && <LessonParticipantStatusList participants={lesson.participants} />}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 8,
    },
    actionBlock: {
        flexDirection: 'row',
        marginBottom: 8,
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
    icon: {
        paddingTop: 3,
        marginRight: 8,
    },
});

export default LessonDetailStatusBar;
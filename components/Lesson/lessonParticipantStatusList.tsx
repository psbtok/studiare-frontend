import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from "@/styles/Colors";
import commonStyles from "@/styles/CommonStyles";
import { LessonParticipant } from '@/models/models';
import words from '@/locales/ru';
import AntDesign from '@expo/vector-icons/AntDesign';

interface ParticipantStatusListProps {
    participants: LessonParticipant[];
}

function LessonParticipantStatusList({ participants }: ParticipantStatusListProps) {
    const groupedParticipants = participants.reduce((acc, participant) => {
        const status = participant.status;
        if (!acc[status]) {
            acc[status] = [];
        }
        acc[status].push(participant);
        return acc;
    }, {} as Record<string, LessonParticipant[]>);

    const cancelledCompletely = participants.every(selected => selected.status === "cancelled");
    if (cancelledCompletely) {
        return null;
    }

    const statusOrder = ['awaiting_confirmation', 'confirmed', 'cancelled', 'conducted'];
    const statusIcons = {
        awaiting_confirmation: 'clockcircleo',
        confirmed: 'checkcircle',
        cancelled: 'closecircle',
        conducted: 'checkcircleo',
    };

    const ratedParticipants = participants.filter(participant => !!participant.rating);

    return (
        <View>
            {statusOrder.map((status) => {
                const participantsWithStatus = groupedParticipants[status];
                if (!participantsWithStatus || participantsWithStatus.length === 0) {
                    return null; 
                }

                return (
                    <View key={status} style={styles.statusBlock}>
                        <View style={styles.statusHeader}>
                            <AntDesign
                                name={statusIcons[status]}
                                size={22}
                                color={Colors.deepGrey}
                                style={styles.icon}
                            />
                            <Text style={commonStyles.label}>
                                {status === 'awaiting_confirmation' && words.statusAwaitingConfirmation}
                                {status === 'confirmed' && words.statusConfirmed}
                                {status === 'cancelled' && words.statusCancelled}
                                {status === 'conducted' && words.statusConducted}
                                {':'}
                            </Text>
                        </View>
                        <View style={styles.participantItem}>
                            {participantsWithStatus.map((participant, index) => (
                                <Text key={index} style={commonStyles.label}>
                                    {`${participant.profile.user.first_name} ${participant.profile.user.last_name?.charAt(0) || ''}.`}
                                    {index < participantsWithStatus.length - 1 && ', '}
                                </Text>
                            ))}
                        </View>
                    </View>
                );
            })}

            {ratedParticipants.length > 0 && (
                <View style={styles.statusBlock}>
                    <View style={styles.statusHeader}>
                        <AntDesign
                            name="star"
                            size={22}
                            color={Colors.deepGrey}
                            style={styles.icon}
                        />
                        <Text style={commonStyles.label}>
                            {words.lessonRatedBy}:{}
                        </Text>
                    </View>
                    <View style={styles.participantItem}>
                        {ratedParticipants.map((participant, index) => (
                            <Text key={index} style={commonStyles.label}>
                                {`${participant.profile.user.first_name} ${participant.profile.user.last_name?.charAt(0) || ''}.`}
                                {index < ratedParticipants.length - 1 && ', '}
                            </Text>
                        ))}
                    </View>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    statusBlock: {
        backgroundColor: Colors.lightGrey,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 24,
        marginBottom: 8,
    },
    statusHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    icon: {
        marginRight: 8,
        bottom: 2.5,
    },
    participantItem: {
        marginTop: -12,
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
});

export default LessonParticipantStatusList;

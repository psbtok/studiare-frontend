import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from "@/styles/Colors";
import commonStyles from "@/styles/CommonStyles";
import { lessonParticipant } from '@/models/models';
import words from '@/locales/ru';
import AntDesign from '@expo/vector-icons/AntDesign';

interface ParticipantStatusListProps {
    participants: lessonParticipant[];
}

function LessonParticipantStatusList({ participants }: ParticipantStatusListProps) {
    const groupedParticipants = participants.reduce((acc, participant) => {
        const status = participant.status;
        if (!acc[status]) {
            acc[status] = [];
        }
        acc[status].push(participant);
        return acc;
    }, {} as Record<string, lessonParticipant[]>);

    const statusOrder = ['awaiting_confirmation', 'confirmed', 'cancelled', 'conducted'];

    const statusIcons = {
        awaiting_confirmation: 'clockcircleo',
        confirmed: 'checkcircle',
        cancelled: 'closecircle',
        conducted: 'checkcircleo',
    };

    return (
        <View style={styles.container}>
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
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 12,
    },
    statusBlock: {
        backgroundColor: Colors.lightGrey,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 24,
        marginBottom: 12,
    },
    statusHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    icon: {
        marginRight: 8,
        bottom: 2.5
    },
    participantItem: {
        marginTop: -12,
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
});

export default LessonParticipantStatusList;
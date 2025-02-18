import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Profile } from "@/models/models";
import { ratingColors, Colors } from '@/styles/Colors';
import { Typography } from '@/styles/Typography';

const TutorRatingTile = ({ profile }: { profile: Profile }) => {
    const [totalRating, setTotalRating] = useState(0);
    const [peopleReacted, setPeopleReacted] = useState(1); 

    useEffect(() => {
        if (profile.tutor) {
            setTotalRating(profile.tutor.totalRating);
            setPeopleReacted(profile.tutor.peopleReacted);
        }
    }, [profile]);

    const ratingValue = peopleReacted > 0 ? parseFloat((totalRating / peopleReacted).toFixed(1)) : 0;
    const getColor = () => {
        if (ratingValue == 0) return Colors.stoneGrey;
        if (ratingValue >= 4.9) return ratingColors[0]; 
        if (ratingValue >= 4.4) return ratingColors[1]; 
        if (ratingValue >= 4.0) return ratingColors[2]; 
        if (ratingValue >= 3.5) return ratingColors[3]; 
        return ratingColors[4]; 
    };
    const color = getColor

    return (
        <View style={styles.container}>
            <View style={[styles.circle, { backgroundColor: getColor() }]}>
                <Text style={styles.ratingText}>{ratingValue.toFixed(1)}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 4,
    },
    circle: {
        height: 40,
        width: 40,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    ratingText: {
        fontSize: Typography.fontSizes.s,
        color: Colors.paleGrey,
        fontWeight: 'bold',
    },
});

export default TutorRatingTile;

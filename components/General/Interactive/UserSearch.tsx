import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet, Keyboard } from 'react-native';
import { getUserIdByFullNameService } from '@/services/authService';
import words from '@/locales/ru';
import commonStyles from '@/styles/CommonStyles';
import Button from '@/components/General/Interactive/Button';
import { TextInput } from 'react-native';
import { Colors } from '@/styles/Colors';
import { User } from '@/models/models';
import { Typography } from '@/styles/Typography';
import { AntDesign } from '@expo/vector-icons';

interface ParticipantSearchProps {
  onParticipantsSelected: (participants: User[]) => void;
  resetFlag: boolean;
  setResetFlag: (flag: boolean) => void;
  initialParticipants?: User[];
}

const ParticipantSearch = ({ onParticipantsSelected, resetFlag, setResetFlag, initialParticipants }: ParticipantSearchProps) => {
  const [participantName, setParticipantName] = useState('');
  const [participants, setParticipants] = useState<User[]>([]);
  const [chosenParticipants, setChosenParticipants] = useState<User[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  
  useEffect(() => {
    if (resetFlag) {
      setParticipantName('');
      setParticipants([]);
      setChosenParticipants([]);
      setErrorMessage('');
      setResetFlag(false);
    }
  }, [resetFlag, setResetFlag]);

  useEffect(() => {
    if (initialParticipants && initialParticipants.length > 0) {
      setChosenParticipants(initialParticipants);
      onParticipantsSelected(initialParticipants);
    }
  }, [initialParticipants, onParticipantsSelected]);

  const handleSearchParticipant = async () => {
    if (!participantName.trim()) {
      Alert.alert(words.error, words.enterParticipantName);
      return;
    }

    try {
      const users = await getUserIdByFullNameService(participantName);
      if (users.length === 0) {
        setErrorMessage(words.nooneFound);
      } else if (users.length === 1) {
        setParticipants(users);
        setChosenParticipants([users[0], ...chosenParticipants]);
      }
      else {
        setErrorMessage('');
        setParticipants(users);
      }
    } catch (error) {
      setErrorMessage(words.nooneFound); // Set error message on failure
    }
  };

  const handleChooseParticipant = (participant: User) => {
    const exists = chosenParticipants.some(selected => selected.id === participant.id);
    let updatedChosenParticipants;

    if (exists) {
      return;
    } else {
      updatedChosenParticipants = [...chosenParticipants, participant];
    }

    setChosenParticipants(updatedChosenParticipants);
    onParticipantsSelected(updatedChosenParticipants);
  };

  const handleDeselectParticipant = (participant: User) => {
    const updatedChosenParticipants = chosenParticipants.filter(selected => selected.id !== participant.id);
    setChosenParticipants(updatedChosenParticipants);
    onParticipantsSelected(updatedChosenParticipants);
  };

  const handleSubmitEditing = () => {
    handleSearchParticipant();
    Keyboard.dismiss();
  };

  const handleChangeText = (text: string) => {
    setParticipantName(text);
    if (text.trim()) {
      setErrorMessage(''); 
    } else {
      setParticipants([]); 
    }
  };

  return (
    <View style={styles.searchContainer}>
      <Text style={commonStyles.label}>{words.participantName}</Text>
      <View style={styles.inputContainer}>
        <View style={styles.input}>
          <TextInput
            style={commonStyles.input}
            placeholder={words.enterParticipantName}
            placeholderTextColor={Colors.mediumGrey}
            value={participantName}
            onChangeText={handleChangeText} 
            onSubmitEditing={handleSubmitEditing}
            returnKeyType="search"
          />
        </View>
        <View style={styles.searchButton}>
          <Button label={words.search} onPress={handleSearchParticipant} />
        </View>
      </View>

      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text> 
      ) : (
        participants.map((item) => (
          <TouchableOpacity key={item.id} onPress={() => handleChooseParticipant(item)}>
            <View style={styles.participantItem}>
              <Text
                style={[styles.participantName, chosenParticipants.some(selected => selected.id === item.id) && styles.selectedParticipantName]}
              >
                {item.first_name} {item.last_name}
              </Text>
            </View>
          </TouchableOpacity>
        ))
      )}

      {chosenParticipants.length > 0 && (
        <View style={styles.selectedParticipantsContainer}>
          <Text style={commonStyles.label}>{words.selectedParticipants}</Text>
          {chosenParticipants.map((participant) => (
            <View key={participant.id} style={styles.selectedParticipantItem}>
              <Text style={styles.participantName}>
                {participant.first_name} {participant.last_name}
              </Text>
              <TouchableOpacity onPress={() => handleDeselectParticipant(participant)}>
                <Text style={styles.removeParticipant}>
                  <AntDesign name="minus" size={36} color={Colors.alertRed} />
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    marginBottom: 20,
  },
  inputContainer: {
    height: 52,
    flexDirection: 'row',
  },
  input: {
    flexGrow: 1,
  },
  searchButton: {
    width: 100,
    marginLeft: 8,
    bottom: 1,
    flexShrink: 1,
  },
  participantItem: {
    padding: 10,
    borderBottomWidth: 2,
    borderBottomColor: Colors.lightGrey,
  },
  participantName: {
    color: Colors.deepGrey,
    fontSize: 16,
  },
  selectedParticipantName: {
    fontWeight: 'bold',
    color: Colors.mediumGrey,
  },
  selectedParticipantsContainer: {
    marginTop: 20,
  },
  selectedParticipantItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGrey,
  },
  removeParticipant: {
    fontSize: Typography.fontSizes.xxl,
    color: Colors.alertRed,
  },
  errorText: {
    color: Colors.alertRed,
    marginTop: 10,
  },
});

export default ParticipantSearch;

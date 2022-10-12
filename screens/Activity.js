import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { List } from 'react-native-paper';
import { getDatabase, ref, onValue } from 'firebase/database';


export default function Activity() {
    const [data, setData] = useState({});
    const [matchData, setMatchData] = useState({});

    useEffect(() => {
        getData();
    }, [])

    const getData = () => {
        const db = getDatabase();
        const eventsRef = ref(db, 'events/');
        onValue(eventsRef, (snapshot) => {
            const events = snapshot.val();
            setData(events);
        })
        const fullMatchRef = ref(db, "full_match/");
        onValue(fullMatchRef, (snapshot) => {
            const matches = snapshot.val();
            setMatchData(matches);
        })
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <List.Section title="Drills">
                {Object.keys(data).map((event, i) => (     
                        <List.Accordion
                            title={data[event].type}
                            right={props => <Text>{data[event].date_string}</Text>}
                            style={{ backgroundColor: "white" }}
                            key={i}
                        >
                            <View style={{ backgroundColor: "#F8F7F4", width: "100%", paddingHorizontal: 10 }}>
                                <View style={{ flexDirection: "row", width: "100%" }}>
                                    <View style={{ flex: 0.25 }}>
                                        <Text></Text>
                                        <Text>Lower</Text>
                                        <Text>Upper</Text>
                                        <Text>Lower Accuracy</Text>
                                        <Text>Upper Accuracy</Text>
                                    </View>
                                    <View style={styles.column}>
                                        <Text>Auto</Text>
                                        <Text>{matchData[event].auto_lower}</Text> 
                                        <Text>{matchData[event].auto_upper}</Text> 
                                        <Text>{matchData[event].auto_lower_acc}</Text>
                                        <Text>{matchData[event].auto_upper_acc}</Text> 
                                    </View>
                                    <View style={styles.column}>
                                        <Text>Teleop</Text> 
                                        <Text>{matchData[event].tele_lower}</Text> 
                                        <Text>{matchData[event].tele_upper}</Text> 

                                    </View>
                                    <View style={styles.column}>
                                        <Text>Endgame</Text>
                                        <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
                                            <Text>{matchData[event].endgame}</Text>
                                        </View> 
                                    </View>
                                </View>
                            </View>
                        </List.Accordion>
                ))
                }
            </List.Section>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        paddingHorizontal: 10
    },
    column: {
        flex: 0.25,
        alignItems: "center"
    }
})
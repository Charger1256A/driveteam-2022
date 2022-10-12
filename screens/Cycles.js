import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native"
import { Button, Card, Title, TextInput } from 'react-native-paper';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer'

export default function Cycles() {
    const [flush, setFlush] = useState(0);
    const [vision, setVision] = useState(0);
    const [timeType, setTimeType] = useState("timer");
    const [key, setKey] = useState(0);
    const [timerPlaying, setTimerPlaying] = useState(false);
    const [time, setTime] = useState("");
    const [duration, setDuration] = useState(150);

    useEffect(() => {
        parseTime();
    }, [time])

    const decrementFlush = () => {
        if (flush !== 0) {
            setFlush(flush - 1);
        }
    }

    const incrementFlush = () => {
        setFlush(flush + 1);
    }

    const decrementVision = () => {
        if (vision !== 0) {
            setVision(vision - 1);
        }
    }

    const incrementVision = () => {
        setVision(vision + 1);
    }
   
    const parseTime = () => {
        var times = time.split(":");
        var seconds = parseInt(times[0]) * 60 + parseInt(times[1]);
        if (!seconds) {
            setDuration(150);
        } else {
            setDuration(seconds);
        }
       
    }

    return (
        <View style={styles.container}>
            <View style={styles.row}>
                <Card style={[styles.card, { width: "45%", marginRight: 10 }]}>
                    <Card.Content>
                        <Title>Teleop</Title>
                        <View style={[styles.container, { height: "80%" }]}>
                            <View style={styles.cardRow}>
                                <Button color="white" style={styles.button} onPress={() => decrementFlush()}>-</Button>
                                <View style={{ alignItems: "center" }}>
                                    <Text style={{ fontSize: 30 }}>{flush}</Text>
                                    <Text>Flush</Text>
                                </View>
                                <Button color="white" style={styles.button} onPress={() => incrementFlush()}>+</Button>
                            </View>
                            <View style={styles.cardRow}>
                                <Button color="white" style={styles.button} onPress={() => decrementVision()}>-</Button>
                                <View style={{ alignItems: "center" }}>
                                    <Text style={{ fontSize: 30 }}>{vision}</Text>
                                    <Text>Vision</Text>
                                </View>
                                <Button color="white" style={styles.button} onPress={() => incrementVision()}>+</Button>
                            </View>
                        </View>
                    </Card.Content>
                </Card>
                <Card style={[styles.card, { width: "45%" }]}>
                    <Card.Content>
                        <Title>Time</Title>
                        <View style={styles.tabRow}>
                            <Button onPress={() => setTimeType("timer")}>
                                <Text>Timer</Text>
                            </Button>
                            <Button onPress={() => setTimeType("stopwatch")}>
                                <Text>Stopwatch</Text>
                            </Button>
                        </View>
                        <View style={[styles.container, { height: "80%" }]}>
                            <CountdownCircleTimer
                                key={key}
                                isPlaying={timerPlaying}
                                duration={duration}
                                colors={['#01FF00', '#FFE800', '#FF9900', '#FF0000']}
                                colorsTime={[150, 30, 15, 0]}
                            >
                                {({ remainingTime }) => <Text>{remainingTime}</Text>}
                            </CountdownCircleTimer>
                            <View style={[styles.cardRow, { marginTop: 30, paddingHorizontal: 20 }]}>
                                <Button color="white" style={[styles.button, {width: "30%"}]} onPress={() => setTimerPlaying(!timerPlaying)}>{timerPlaying ? "Pause" : "Start"}</Button>
                                <Button color="white" style={[styles.button, {width: "30%"}]} onPress={() => {setTimerPlaying(false); setKey(key + 1);}}>Reset</Button>
                                <TextInput label="time" style={{ width: "30%", height: 40 }}value={time} onChangeText={(text) => setTime(text)} />
                            </View>
                        </View>
                    </Card.Content>
                </Card>
            </View>
            <View style={styles.row}>
                <Card style={[styles.card, { width: "91%" }]}>

                </Card>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
    },
    row: {
        justifyContent: "center",
        flexDirection: "row",
        width: "100%",
        height: "50%",
        paddingVertical: 10,
    },
    card: {
        height: "100%",
    },
    cardRow: {
        flexDirection: "row", 
        width: "100%", 
        justifyContent: "center", 
        alignItems: "center",
        marginVertical: 5,
    },
    tabRow: {
        flexDirection: "row",
        width: "100%", 
        borderBottomWidth: 1,
        borderBottomColor: "black"
    },
    button: {
        backgroundColor: "#9A14EC", 
        borderRadius: "30%",
        marginHorizontal: 20,
    },
    timeValue: {
        marginVertical: 20,
    },
})
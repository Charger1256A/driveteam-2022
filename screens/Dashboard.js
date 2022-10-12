import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native"
import { getDatabase, ref, onValue } from 'firebase/database';
import { VictoryLine, VictoryChart, VictoryTheme } from "victory-native";
import { useIsFocused } from "@react-navigation/native";
import { Card, Title } from 'react-native-paper';
import { getMin, getMax, getAvg, getAcc, getClimbTot } from "../utilities";


export default function Dashboard() {
    const [data, setData] = useState({});
    const [autoLowerData, setAutoLowerData] = useState([]);
    const [autoUpperData, setAutoUpperData] = useState([]);
    const [teleLowerData, setteleLowerData] = useState([]);
    const [teleUpperData, setteleUpperData] = useState([]);
    const [showAutoLowerLine, setShowAutoLowerLine] = useState(false);
    const [showAutoUpperLine, setShowAutoUpperLine] = useState(true);
    const [showteleLowerLine, setShowteleLowerLine] = useState(false);
    const [showteleUpperLine, setShowteleUpperLine] = useState(true);
    const [dates, setDates] = useState([])
    const [autoLowerMin, setAutoLowerMin] = useState(0);
    const [autoLowerAvg, setAutoLowerAvg] = useState(0);
    const [autoLowerMax, setAutoLowerMax] = useState(0);
    const [autoLowerAcc, setAutoLowerAcc] = useState(0);
    const [autoUpperMin, setAutoUpperMin] = useState(0);
    const [autoUpperAvg, setAutoUpperAvg] = useState(0);
    const [autoUpperMax, setAutoUpperMax] = useState(0);
    const [autoUpperAcc, setAutoUpperAcc] = useState(0);
    const [teleLowerMin, setTeleLowerMin] = useState(0);
    const [teleLowerAvg, setTeleLowerAvg] = useState(0);
    const [teleLowerMax, setTeleLowerMax] = useState(0);
    const [teleUpperMin, setTeleUpperMin] = useState(0);
    const [teleUpperAvg, setTeleUpperAvg] = useState(0);
    const [teleUpperMax, setTeleUpperMax] = useState(0);
    const [noClimb, setNoClimb] = useState(0);
    const [lowClimb, setLowClimb] = useState(0);
    const [midClimb, setMidClimb] = useState(0);
    const [highClimb, setHighClimb] = useState(0);
    const [traversalClimb, setTraversalClimb] = useState(0);
    const [matchesPlayed, setMatchesPlayed] = useState(0);
    
    const isFocused = useIsFocused();

    window.count = 1;

    useEffect(() => {
        setDates([]);
        getData();
        // makeGraphData();
    }, [isFocused]);

    useEffect(() => {
        makeGraphData();
    }, [data])

    const getData = () => {
        const db = getDatabase();
        const reference = ref(db, 'full_match/');
        onValue(reference, (snapshot) => {
            const matches = snapshot.val();
            setData(matches);

            setAutoLowerMin(getMin(matches, "auto_lower"));
            setAutoLowerAvg(getAvg(matches, "auto_lower"));
            setAutoLowerMax(getMax(matches, "auto_lower"));
            setAutoLowerAcc(getAcc(matches, "auto_lower"));

            setAutoUpperMin(getMin(matches, "auto_upper"));
            setAutoUpperAvg(getAvg(matches, "auto_upper"));
            setAutoUpperMax(getMax(matches, "auto_upper"));
            setAutoUpperAcc(getAcc(matches, "auto_upper"));

            setTeleLowerMin(getMin(matches, "tele_lower"));
            setTeleLowerAvg(getAvg(matches, "tele_lower"));
            setTeleLowerMax(getMax(matches, "tele_lower"));
            
            setTeleUpperMin(getMin(matches, "tele_upper"));
            setTeleUpperAvg(getAvg(matches, "tele_upper"));
            setTeleUpperMax(getMax(matches, "tele_upper"));

            setNoClimb(getClimbTot(matches, "No Climb"));
            setLowClimb(getClimbTot(matches, "Low Climb"));
            setMidClimb(getClimbTot(matches, "Mid Climb"));
            setHighClimb(getClimbTot(matches, "High Climb"));
            setTraversalClimb(getClimbTot(matches, "Traversal Climb"))

            setMatchesPlayed(Object.keys(matches).length);
        });
    }
    
    const convertDate = (date) => {
        var d = new Date(date);
        var dString = `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
        if (!dates.includes(dString)) {
            var lDates = dates;
            lDates.push(dString);
            setDates(lDates);
            window.count = 1;
        } else {
            window.count++;
        }
        
        return `${dString} (${window.count})`;
    }

    const makeGraphData = () => {
        var autoLower = [];
        var autoUpper = [];
        var teleLower = [];
        var teleUpper = [];
        for (var match in data) {
            var matchString = convertDate(match);
            autoLower.push({ x: matchString, y: data[match].auto_lower });
            autoUpper.push({ x: matchString, y: data[match].auto_upper });
            teleLower.push({ x: matchString, y: data[match].tele_lower });
            teleUpper.push({ x: matchString, y: data[match].tele_upper });
        }


        setAutoLowerData(autoLower);
        setAutoUpperData(autoUpper);
        setteleLowerData(teleLower);
        setteleUpperData(teleUpper);
    }

    return (
        <View style={styles.container}>
            <Text style={{ position: "absolute", top: 10, left: 10, fontSize: 20 }}>Matches Played: {matchesPlayed || matchesPlayed === 0 && matchesPlayed}</Text>
            {autoLowerData && 
                <VictoryChart theme={VictoryTheme.material} width={1000}>
                    {showAutoLowerLine &&
                        <VictoryLine
                            style={{
                            data: { stroke: "#c43a31" },
                            parent: { border: "1px solid #ccc"}
                            }}
                            data={autoLowerData}
                        />
                    }
                    {showAutoUpperLine &&
                        <VictoryLine
                            style={{
                            data: { stroke: "#0CA0C4" },
                            parent: { border: "1px solid #ccc"}
                            }}
                            data={autoUpperData}
                        />
                    }
                    {showteleLowerLine &&
                        <VictoryLine
                            style={{
                            data: { stroke: "#0CC439" },
                            parent: { border: "1px solid #ccc"}
                            }}
                            data={teleLowerData}
                        />
                    }
                    {showteleUpperLine &&
                        <VictoryLine
                            style={{
                            data: { stroke: "#B20CC4" },
                            parent: { border: "1px solid #ccc"}
                            }}
                            data={teleUpperData}
                        />
                    }
                </VictoryChart>
            }
            <View style={styles.legend}>
                <TouchableOpacity style={styles.legendItem} onPress={() => setShowAutoLowerLine(!showAutoLowerLine)}>
                    <View style={[styles.legendBox, {backgroundColor: "#c43a31"}]}></View>
                        <Text style={!showAutoLowerLine && { color: "grey" }}>Auto Lower</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.legendItem} onPress={() => setShowAutoUpperLine(!showAutoUpperLine)}>
                    <View style={[styles.legendBox, {backgroundColor: "#0CA0C4"}]}></View>
                    <Text style={!showAutoUpperLine && { color: "grey" }}>Auto Upper</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.legendItem} onPress={() => setShowteleLowerLine(!showteleLowerLine)}>
                    <View style={[styles.legendBox, {backgroundColor: "#0CC439"}]}></View>
                        <Text style={!showteleLowerLine && { color: "grey" }}>Teleop Lower</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.legendItem} onPress={() => setShowteleUpperLine(!showteleUpperLine)}>
                    <View style={[styles.legendBox, {backgroundColor: "#B20CC4"}]}></View>
                    <Text style={!showteleUpperLine && { color: "grey" }}>Teleop Upper</Text>
                </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={[styles.container, { paddingnTop: 10, paddingBottom: 100, width: "87%" }]}>
                <View style={styles.row}>
                    <Card style={styles.card}>
                        <Card.Content>
                            <Title>Auto</Title>
                            <View style={styles.container}>
                                <View style={styles.cardRow}>
                                    <View style={styles.container}>
                                        <Text style={{ fontSize: 30 }}>{autoLowerMin || autoLowerMin === 0 ? autoLowerMin : "N/A"}</Text>
                                        <Text>Min</Text>
                                    </View>
                                    <View style={styles.container}>
                                        <Text style={{ fontSize: 30 }}>{autoLowerAvg || autoLowerAvg === 0? autoLowerAvg : "N/A"}</Text>
                                        <Text>Avg</Text>
                                    </View>
                                    <View style={styles.container}>
                                        <Text style={{ fontSize: 30 }}>{autoLowerMax || autoLowerMax === 0 ? autoLowerMax : "N/A"}</Text>
                                        <Text>Max</Text>
                                    </View>
                                    <View style={styles.container}>
                                        <Text style={{ fontSize: 30 }}>{autoLowerAcc ? autoLowerAcc : "N/A"}</Text>
                                        <Text>Acc</Text>
                                    </View>
                                </View>
                                <Text style={styles.rowLabel}>Lower</Text>
                                <View style={{ width: "90%", borderWidth: 1, borderColor: "#B9BFBE" }} />
                            </View>
                            <View style={[styles.container, { marginTop: 10 }]}>
                                <View style={styles.cardRow}>
                                    <View style={styles.container}>
                                        <Text style={{ fontSize: 30 }}>{autoUpperMin || autoUpperMin === 0 ? autoUpperMin : "N/A"}</Text>
                                        <Text>Min</Text>
                                    </View>
                                    <View style={styles.container}>
                                        <Text style={{ fontSize: 30 }}>{autoUpperAvg || autoUpperAvg === 0 ? autoUpperAvg : "N/A"}</Text>
                                        <Text>Avg</Text>
                                    </View>
                                    <View style={styles.container}>
                                        <Text style={{ fontSize: 30 }}>{autoUpperMax || autoUpperMax === 0 ? autoUpperMax : "N/A"}</Text>
                                        <Text>Max</Text>
                                    </View>
                                    <View style={styles.container}>
                                        <Text style={{ fontSize: 30 }}>{autoUpperAcc ? autoUpperAcc : "N/A"}</Text>
                                        <Text>Acc</Text>
                                    </View>
                                </View>
                                <Text style={styles.rowLabel}>Upper</Text>
                                <View style={{ width: "90%", borderWidth: 1, borderColor: "#B9BFBE" }} />
                            </View>
                        </Card.Content>
                    </Card>
                    <Card style={styles.card}>
                        <Card.Content>
                            <Title>Teleop</Title>
                            <View style={styles.container}>
                                <View style={styles.cardRow}>
                                    <View style={styles.container}>
                                        <Text style={{ fontSize: 30 }}>{teleLowerMin || teleLowerMin === 0 ? teleLowerMin : "N/A"}</Text>
                                        <Text>Min</Text>
                                    </View>
                                    <View style={styles.container}>
                                        <Text style={{ fontSize: 30 }}>{teleLowerAvg  || teleLowerAvg === 0 ? teleLowerAvg : "N/A"}</Text>
                                        <Text>Avg</Text>
                                    </View>
                                    <View style={styles.container}>
                                        <Text style={{ fontSize: 30 }}>{teleLowerMax || teleLowerMax === 0 ? teleLowerMax : "N/A"}</Text>
                                        <Text>Max</Text>
                                    </View>
                                </View>
                                <Text style={styles.rowLabel}>Lower</Text>
                                <View style={{ width: "90%", borderWidth: 1, borderColor: "#B9BFBE" }} />
                            </View>
                            <View style={[styles.container, { marginTop: 10 }]}>
                                <View style={styles.cardRow}>
                                    <View style={styles.container}>
                                        <Text style={{ fontSize: 30 }}>{teleUpperMin || teleUpperMin === 0 ? teleUpperMin : "N/A"}</Text>
                                        <Text>Min</Text>
                                    </View>
                                    <View style={styles.container}>
                                        <Text style={{ fontSize: 30 }}>{teleUpperAvg || teleUpperAvg === 0 ? teleUpperAvg : "N/A"}</Text>
                                        <Text>Avg</Text>
                                    </View>
                                    <View style={styles.container}>
                                        <Text style={{ fontSize: 30 }}>{teleUpperMax || teleUpperMax === 0 ? teleUpperMax : "N/A"}</Text>
                                        <Text>Max</Text>
                                    </View>
                                </View>
                                <Text style={styles.rowLabel}>Upper</Text>
                                <View style={{ width: "90%", borderWidth: 1, borderColor: "#B9BFBE" }} />
                            </View>
                        </Card.Content>
                    </Card>
                </View>
                <View style={styles.row}>
                    <Card style={[styles.card, { width: "92%" }]}>
                        <Card.Content>
                            <Title>Endgame</Title>
                            <View style={styles.container}>
                                <View style={styles.cardRow}>
                                    <View style={styles.container}>
                                        <Text style={{ fontSize: 30 }}>{noClimb || noClimb === 0 ? noClimb : "N/A"}</Text>
                                        <Text>None</Text>
                                    </View>
                                    <View style={styles.container}>
                                        <Text style={{ fontSize: 30 }}>{lowClimb || lowClimb === 0 ? lowClimb : "N/A"}</Text>
                                        <Text>Low</Text>
                                    </View>
                                    <View style={styles.container}>
                                        <Text style={{ fontSize: 30 }}>{midClimb || midClimb === 0 ? midClimb : "N/A"}</Text>
                                        <Text>Mid</Text>
                                    </View>
                                    <View style={styles.container}>
                                        <Text style={{ fontSize: 30 }}>{highClimb || highClimb === 0 ? highClimb : "N/A"}</Text>
                                        <Text>High</Text>
                                    </View>
                                    <View style={styles.container}>
                                        <Text style={{ fontSize: 30 }}>{traversalClimb || traversalClimb === 0 ? traversalClimb : "N/A"}</Text>
                                        <Text>Traversal</Text>
                                    </View>
                                </View>
                                <Text style={styles.rowLabel}>Climbs</Text>
                                <View style={{ width: "90%", borderWidth: 1, borderColor: "#B9BFBE" }} />
                            </View>
                        </Card.Content>
                    </Card>
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: "center",
    },
    legend: {
        borderWidth: 3,
        borderColor: "black",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 10,
        width: "80%",
    },
    legendItem: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    legendBox: {
        width: 10,
        height: 10,
        marginRight: 7
    },
    row: {
        flexDirection: "row",
    },
    card: {
        width: "45%",
        margin: 10,
    },
    cardRow: {
        flexDirection: "row",
        width: "50%",
        justifyContent: "space-between", 
        alignItems: "center",
    },
    rowLabel: {
        fontSize: 17, 
        color: "#B9BFBE", 
        marginTop: 10
    }
})
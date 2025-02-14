import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Svg, G, Path } from "react-native-svg";
import { Colors, subjectColors } from "@/styles/Colors"; // Assuming your colors are stored here
import { getLessonStatsService } from "@/services/lessonService";
import { pie, arc } from "d3-shape";
import commonStyles from "@/styles/CommonStyles";

interface ChartData {
  subject: string;
  lesson_count: number;
  color: string;
}

const ProfileSubjectChart: React.FC = () => {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPie, setSelectedPie] = useState<{ index: number; text: string }>({ index: -1, text: '' });

  useEffect(() => {
    const fetchLessonStats = async () => {
      try {
        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        const dateStart = firstDayOfMonth.toISOString();
        const dateEnd = lastDayOfMonth.toISOString();

        const stats = await getLessonStatsService(dateStart, dateEnd);

        const formattedData = stats.map((item, index) => ({
          subject: item.subject,
          lesson_count: item.lesson_count,
          color: subjectColors[item.colorId - 1] || subjectColors[0] // Use your color mapping
        }));

        setChartData(formattedData);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch lesson statistics.");
        setLoading(false);
      }
    };

    fetchLessonStats();
  }, []);

  const getLessonsLabel = (count: number) => {
    if (count === 1) {
      return `${count} занятие`;
    } else if (count >= 2 && count <= 4) {
      return `${count} занятия`;
    } else {
      return `${count} занятий`;
    }
  };
  
  const onPieItemSelected = (index: number) => () => {
    const lessonCount = index < 0 ? 0 : chartData[index].lesson_count;
    setSelectedPie(index < 0 ? { index: -1, text: `Выберите элемент` } : {
      index,
      text: getLessonsLabel(lessonCount)
    });
  };

  const DonutSlice: React.FC<{ color: string; arcData: any; onSelected: () => void; isActive: boolean }> = ({ color, arcData, onSelected, isActive }) => {
    const outerRadius = isActive ? 130 : 120; // Increase the outer radius for the active slice
    const d = arc().outerRadius(outerRadius).innerRadius(60)(arcData);

    return (
      <Path
        d={d}
        fill={color}
        onPressIn={onSelected} // Use onPressIn for better touch handling
        stroke={isActive ? Colors.paleGrey : 'none'}
        strokeWidth={isActive ? 8 : 0}
      />
    );
  };

  const Pie: React.FC<{ data: ChartData[]; size: number; onItemSelected: (index: number) => () => void }> = ({ data, size, onItemSelected }) => {
    const arcs = pie<ChartData>().value(item => item.lesson_count)(data);

    return (
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <G transform={`translate(${size / 2}, ${size / 2})`}>
          {arcs.map((arcData, index) => {
            const color = data[index].color;
            return (
              <DonutSlice
                key={`slice_${index}`}
                color={color}
                arcData={arcData}
                onSelected={onItemSelected(index)}
                isActive={selectedPie.index === index}
              />
            );
          })}
        </G>
        <Text
          style={[styles.selectedText, commonStyles.label]}
        >
          {selectedPie.text}
        </Text>
      </Svg>
    );
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  return (
    <View style={styles.container}>
      <View>
        <Pie
          data={chartData}
          size={250}
          onItemSelected={onPieItemSelected}
        />
        <View style={styles.legend}>
            {chartData.map((item, index) => (
                <TouchableOpacity
                style={styles.labelBlock}
                key={index}
                onPress={onPieItemSelected(index)}
                >
                <View style={[styles.circle, { backgroundColor: item.color }]}></View>
                <Text style={[
                    commonStyles.label, 
                    selectedPie.index === index ? 
                        {fontWeight: 800} : 
                        {fontWeight: 500, color: Colors.mediumGrey}]}
                >
                    {item.subject}
                </Text>
                </TouchableOpacity>
            ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  legend: {
    marginTop: 20,
  },
  circle: {
    width: 16,
    height: 16,
    borderRadius: 16,
    bottom: 4,
    marginRight: 8
  },
  labelBlock: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  selectedText: {
    left: -40,
    top: -10,
  },
  selectedLabel: {
    fontWeight: '800',
  },
});

export default ProfileSubjectChart;
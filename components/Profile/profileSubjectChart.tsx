import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Svg, G, Path } from "react-native-svg";
import { Colors, subjectColors } from "@/styles/Colors"; // Assuming your colors are stored here
import { getLessonStatsService } from "@/services/lessonService";
import { pie, arc } from "d3-shape";
import commonStyles from "@/styles/CommonStyles";
import words from "@/locales/ru";
import { Profile } from "@/models/models";

type Props = {
  profile: Profile;
};

interface ChartData {
  subject: string;
  lesson_count: number;
  color: string;
}

const ProfileSubjectChart = ({ profile }: Props) => {
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
          color: subjectColors[item.colorId - 1] || subjectColors[0]
        }));

        if (formattedData.length) {
          setChartData(formattedData);
        }
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

  const DonutSlice = ({ color, arcData, onSelected, isActive }: { color: string; arcData: any; onSelected: () => void; isActive: boolean }) => {
    const outerRadius = isActive ? 130 : 120;
    const d = arc().outerRadius(outerRadius).innerRadius(60)(arcData);

    return (
      <Path
        d={d}
        fill={color}
        onPressIn={onSelected}
        stroke={isActive ? Colors.paleGrey : 'none'}
        strokeWidth={isActive ? 8 : 0}
      />
    );
  };

  const Pie = ({ data, size, onItemSelected }: { data: ChartData[]; size: number; onItemSelected: (index: number) => () => void }) => {
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
      </Svg>
    );
  };

  if (loading) {
    return <Text>{words.loading}..</Text>;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  if (chartData.length === 0) {
    return <View></View>
  }

  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        <Text style={commonStyles.label}>
          {selectedPie.text}
        </Text>
      </View>
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
                { fontWeight: 800 } :
                { fontWeight: 500, color: Colors.mediumGrey }
            ]}
            >
              {item.subject}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  legend: {
    marginTop: 20,
    paddingHorizontal: 16,
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
  selectedLabel: {
    fontWeight: '800',
  },
  labelContainer: {
    width: '100%',
    paddingLeft: 24,
    top: 20,
    marginTop: -16
  }
});

export default ProfileSubjectChart;

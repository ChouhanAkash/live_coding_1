import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet
} from 'react-native';

const App = () => {
  const [jobs, setJobs] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isEndReached, setIsEndReached] = useState(false);

  const fetchJobs = async () => {
    if (loading || isEndReached) return;

    setLoading(true);
    try {
      const res = await fetch(`https://testapi.getlokalapp.com/common/jobs?page=${page}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      const json = await res.json();
      const newJobs = json?.results || []; 

      if (newJobs.length === 0) {
        setIsEndReached(true);
      } else {
        setJobs(prev => [...prev, ...newJobs]);
        setPage(prev => prev + 1);
      }
    } catch (error) {
      console.error('Failed to fetch jobs:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.location}>
        {item.primary_details?.Place || 'Location not available'}
      </Text>
      <Text style={styles.salary}>
        {item.primary_details?.Salary || 'Salary not mentioned'}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={jobs}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.id}_${index}`}
        onEndReached={fetchJobs}
        onEndReachedThreshold={0.6}
        ListFooterComponent={
          loading ? (
            <ActivityIndicator size="small" color="#007aff" style={{ marginTop: 10 }} />
          ) : isEndReached ? (
            <Text style={styles.footerText}>No more jobs to load</Text>
          ) : null
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f2f2f2' 
  },
  card: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 2 
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black'
  },
  location: {
    fontSize: 14,
    color: 'gray',
    marginTop: 4
  },
  salary: {
    fontSize: 14,
    color: 'rgba(28, 124, 84, 0.9)',
    marginTop: 2
  },
  footerText: {
    textAlign: 'center',
    color: 'rgba(150, 150, 150, 0.9)',
    paddingVertical: 16
  }
});

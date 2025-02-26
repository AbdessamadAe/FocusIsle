// Simplified world map data with major regions
export const worldMapData = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": { "name": "United States" },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[-125, 48], [-125, 30], [-95, 30], [-95, 48], [-125, 48]]]
      }
    },
    {
      "type": "Feature",
      "properties": { "name": "India" },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[68, 33], [68, 8], [97, 8], [97, 33], [68, 33]]]
      }
    },
    {
      "type": "Feature",
      "properties": { "name": "Germany" },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[6, 54], [6, 47], [15, 47], [15, 54], [6, 54]]]
      }
    },
    {
      "type": "Feature",
      "properties": { "name": "Japan" },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[130, 45], [130, 31], [145, 31], [145, 45], [130, 45]]]
      }
    },
    {
      "type": "Feature",
      "properties": { "name": "Brazil" },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[-74, 5], [-74, -33], [-34, -33], [-34, 5], [-74, 5]]]
      }
    }
  ]
}; 
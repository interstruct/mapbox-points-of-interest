#!/usr/bin/env ruby

require 'csv'
require 'json'
require 'loofah'

def envelope(features)
  {
    type: "geojson",
    data: {
      type: "FeatureCollection",
      features: features,
    }
  }
end

table = CSV.read(ARGV[0], headers: true, col_sep: ";").to_a
headers = table.shift

table
  .map { |row| Hash[headers.zip(row)] }
  .map
  .with_index do |h, n|
    description = Loofah.fragment(h["description"]).scrub!(:strip).text

    {
      type: "Feature",
      properties: {
        id: n,
        description: description,
        address: h["address"],
        title: h["title"],
        picture: h["pic"],
        icon: "star",
      },
      geometry: {
        type: "Point",
        coordinates: [h["lng"], h["lat"]]
      },

    }
  end
  .then { |features| envelope(features) }
  .then { |geojson| JSON.generate(geojson) }
  .tap { |geojson| puts geojson }


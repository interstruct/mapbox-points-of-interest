#!/usr/bin/env ruby

require 'csv'
require 'json'

def envelope(features)
  {
    type: "geojson",
    data: {
      type: "FeatureCollection",
      features: features,
    }
  }
end

def description(h)
  <<~HTML
    <div class="popup-content">
      <h2>#{h["title"]}</h2>
      <p>#{h["address"]}</p>
      <p>#{h["description"]}</p>
      <img src="#{h["pic"]}" alt="#{h["title"]}" />
    </div>
  HTML
end

table = CSV.read(ARGV[0], headers: true, col_sep: ";").to_a
headers = table.shift

table
  .map { |row| Hash[headers.zip(row)] }
  .map do |h|
    {
      type: "Feature",
      properties: {
        description: description(h),
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


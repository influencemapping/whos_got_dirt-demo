require 'csv'
require 'json'
require 'open-uri'

require 'unicode_utils/downcase'
require 'unicode_utils/upcase'

desc 'Output ISO 3166-1 alpha-2 codes'
task :iso_3166_1_alpha_2 do
  url = 'http://www.iso.org/iso/home/standards/country_codes/country_names_and_code_elements_txt-temp.htm'
  CSV.parse(open(url).read, col_sep: ';', headers: true, skip_blanks: true) do |row|
    code = row['ISO 3166-1-alpha-2 code'].downcase
    name = row['Country Name'].gsub(/(?<=\w)([^,]*)/){
      UnicodeUtils.downcase($1)
    }.gsub(/(?<!')\b(?!(?:and|da|of|part|the)\b)(\w)/){
      UnicodeUtils.upcase($1)
    }
    puts %(["#{code}", "#{name}"],)
  end
end

namespace :coverage do
  def coverage(prefix, reader)
    counts = {}
    url = 'http://www.iso.org/iso/home/standards/country_codes/country_names_and_code_elements_txt-temp.htm'
    CSV.parse(open(url).read, col_sep: ';', headers: true, skip_blanks: true) do |row|
      code = row['ISO 3166-1-alpha-2 code']
      count = reader.call(JSON.load(open("#{prefix}#{code}").read))
      counts[code] = count
    end
    puts "#{counts.values.reduce(:+)} in #{counts.values.reject(&:zero?).size} countries"
    p counts
  end

  desc 'Count the countries in CorpWatch'
  task :corp_watch do
    coverage("http://api.corpwatch.org/companies.json?key=#{ENV['CORP_WATCH_API_KEY']}&limit=0&country_code=", lambda{|body|
      Integer(body.fetch('meta').fetch('total_results'))
    })
  end

  desc 'Count the countries in OpenOil'
  task :open_oil do
    coverage("https://api.openoil.net/concession/search?apikey=#{ENV['OPEN_OIL_API_KEY']}&per_page=0&country=", lambda{|body|
      body.fetch('result_count')
    })
  end
end

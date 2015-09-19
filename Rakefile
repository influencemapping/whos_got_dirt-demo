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

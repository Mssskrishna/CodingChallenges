
// import java.io.File;
import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Scanner;
import java.util.Set;

class Jcut {
    public static Set<Integer> changeAttributes(String attribute, int length) {
        Set<Integer> hashSet = new HashSet<>();
        String[] parts = attribute.split(",");
        for (String part : parts) {
            if (part.contains("-")) {
                int i = part.indexOf("-");
                int start = i - 1 >= 0 && Character.isDigit(attribute.charAt(i - 1))
                        ? Character.getNumericValue(attribute.charAt(i - 1))
                        : 1;
                int end = i + 1 < part.length() && Character.isDigit(attribute.charAt(i + 1))
                        ? Character.getNumericValue(attribute.charAt(i + 1)) < length
                                ? Character.getNumericValue(attribute.charAt(i + 1))
                                : length
                        : length;
                for (int k = start; k <= end; k++) {
                    hashSet.add(k);
                }
            } else {
                int value = Integer.parseInt(part);
                if (value > 0 && value <= length) {
                    hashSet.add(value);
                }
            }
        }

        return hashSet;
    }

    public static Map<String, String> parseAttributes(String[] args) {
        Map<String, String> attributeMap = new HashMap<>();
        for (String arg : args) {
            String key = "", value = "";
            if (arg.startsWith("-")) {
                key = arg.substring(1, 2);
                value = arg.substring(2);
                attributeMap.put(key, value);
            } else {
                key = "filename";
                value = arg;
                attributeMap.put(key, value);
            }
        }
        return attributeMap;
    }

    public static void main(String[] args) throws IOException {
        try {
            Map<String, String> attributemap = parseAttributes(args);
            String delimiter = attributemap.containsKey("d")
                    ? attributemap.containsKey("f") ? attributemap.get("d") : "END"
                    : "\\t";
            if (delimiter == "END") {
                throw new Error("-d must contain -f attribute");
            }
            String fields = attributemap.get("f");
            String filename = attributemap.containsKey("filename") ? attributemap.get("filename") : "";
            Scanner myReader = filename != "" ? new Scanner(new File(filename)) : new Scanner(System.in);

            Set<Integer> hash_Integer = new HashSet<Integer>();
            while (myReader.hasNextLine()) {
                String data = myReader.nextLine();
                String[] parts = data.split(delimiter);
                int partlen = parts.length;
                hash_Integer = changeAttributes(fields, partlen);
                for (Integer i : hash_Integer) {
                    if (i != partlen)
                        System.out.print(parts[i - 1] + delimiter);
                    else
                        System.out.println(parts[i - 1]);
                }
                System.out.println();
            }
            myReader.close();
        }

        catch (IOException e) {
            System.out.println("An error occurred.");
            e.printStackTrace();
        } catch (StringIndexOutOfBoundsException e) {
            System.out.println("Expected Integer or range of Integer");
            e.printStackTrace();
        }

    }

}
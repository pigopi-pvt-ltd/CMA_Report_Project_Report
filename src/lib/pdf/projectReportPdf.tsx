import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 50,
    fontSize: 10,
    fontFamily: "Helvetica",
  },

  title: {
    fontSize: 20,
    textAlign: "center",
    marginBottom: 24,
  },

  sectionTitle: {
    fontSize: 15,
    marginBottom: 8,
    marginTop: 12,
  },

  table: {
    borderWidth: 1,
    borderColor: "#000",
    marginBottom: 16,
  },

  row: {
    flexDirection: "row",
  },

  cellLabel: {
    width: "45%",
    padding: 8,
    fontWeight: "bold",
    borderRightWidth: 1,
    borderRightColor: "#000",
  },

  cellValue: {
    width: "55%",
    padding: 8,
  },
});

function formatLabel(key: string) {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, s => s.toUpperCase());
}

export function ProjectReportPdf({
  personalDetails,
}: {
  personalDetails: Record<string, any>;
}) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* PAGE TITLE */}
        <Text style={styles.title}>Project At A Glance</Text>

        {/* SECTION */}
        <Text style={styles.sectionTitle}>PROMOTER&apos;S DETAILS</Text>

        {/* TABLE */}
        <View style={styles.table}>
          {Object.entries(personalDetails).map(([key, value]) => (
            <View style={styles.row} key={key}>
              <Text style={styles.cellLabel}>
                {formatLabel(key)}
              </Text>
              <Text style={styles.cellValue}>
                {typeof value === "boolean"
                  ? value ? "Yes" : "No"
                  : String(value ?? "-")}
              </Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
}

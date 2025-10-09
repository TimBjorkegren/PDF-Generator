"use client";

import { useState } from "react";
import axios from "axios";
import {
    Page,
    Text,
    View,
    Document,
    StyleSheet,
    PDFDownloadLink,
    Image,
    PDFViewer,
} from "@react-pdf/renderer";

/*
import { saveAs } from "file-saver";
import {
    Document as WordDocument,
    Packer,
    Paragraph as WordParagraph,
    TextRun,
    ImageRun,
    AlignmentType,
    HeadingLevel,
    VerticalAlign,
} from "docx"; */

//StyleSheets can be applied on each text element
const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontSize: 12,
        fontFamily: "Helvetica",
    },
    heading: {
        fontSize: 22,
        fontWeight: "bold",
        marginTop: 16,
        marginBottom: 8,
        textAlign: "left",
    },
    subheadings: {
        fontSize: 16,
        fontWeight: "bold",
        marginTop: 14,
        marginBottom: 8,
    },
    subheadings_1: {
        fontSize: 14,
        fontWeight: "bold",
        marginTop: 14,
        marginBottom: 8,
    },
    paragraph: {
        fontSize: 12,
        marginBottom: 8,
        lineHeight: 1.5,
        textAlign: "left",
    },
    centeredTitle: {
        fontSize: 25,
        textAlign: "center",
        marginBottom: 20,
        fontWeight: "bold",
    },
    footer: {
        position: "absolute",
        bottom: 20,
        left: 0,
        right: 0,
        textAlign: "center",
        fontSize: 10,
    },
    coloredBackground: {
        backgroundColor: "#f2f2f2",
        padding: 5,
        borderRadius: 6,
        marginBottom: 20,
    },
    boldParagraph: {
        fontSize: 12,
        fontWeight: "bold",
        marginBottom: 5,
    },
    label: {
        fontWeight: "bold",
        color: "#21262eff",
        fontSize: 12,
    },
    divider: {
        borderBottomWidth: 1,
        borderBottomColor: "rgba(0,0,0,0.3)",
        marginVertical: 20,
    },
    backgroundWithOutline: {
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 6,
        padding: 5,
        marginBottom: 15,
    },
    listItem: {
        fontSize: 12,
        marginBottom: 4,
        flexDirection: "row",
    },
});

//StyleSheet for introduction heading and favicon
const styleFirstPage = StyleSheet.create({
    page: {
        flexDirection: "column",
        alignItems: "center",
        padding: 40,
        fontSize: 12,
        fontFamily: "Helvetica",
        paddingTop: 100,
    },
    footer: {
        position: "absolute",
        bottom: 20,
        left: 0,
        right: 0,
        textAlign: "center",
        fontSize: 10,
    },
});

//Stylesheet for cover image ("V18_Cover.png")
const imageCoverTop = StyleSheet.create({
    fullWidthImage: {
        width: "100%",
        height: "auto",
        objectFit: "cover",
    },
    topImageContainer: {
        position: "absolute",
        top: 0,
        left: 0,
        width: 595.28,
        height: 841.89,
    },
});

// Reusable Components
const Paragraph = ({ children, style }) => (
    <Text style={[styles.paragraph, style]}>{children}</Text>
);

const Heading = ({ children, style }) => (
    <Text style={[styles.heading, style]}>{children}</Text>
);

const CenteredTitle = ({ children }) => (
    <Text style={styles.centeredTitle}>{children}</Text>
);

// PDF Document Structure/layout
const MyPDF = ({ formData, observations, favicon }) => (
    <Document>
        {/* Image Cover Top*/}
        <Page size="A4">
            <Image
                src="/images/V18_Cover.png"
                style={imageCoverTop.topImageContainer}
            />
        </Page>

        {/* Introduction heading */}
        <Page size="A4" style={styleFirstPage.page}>
            <CenteredTitle>Förslag på SEO-strategi & Årsplan</CenteredTitle>
            {favicon && (
                <Image
                    src={favicon}
                    style={{ width: 64, height: 64, alignSelf: "center" }}
                />
            )}
            {/* Introduction text */}
            <Heading>
                Hej {formData.domainName}! Låt oss växa tillsammans.
            </Heading>
            <Paragraph>
                Tack för att ni överväger oss som er SEO-partner. I dagens
                digitala landskap är en stark närvaro på Google inte bara en
                fördel – det är en nödvändighet. När era potentiella kunder
                söker efter de tjänster eller produkter ni erbjuder, vill vi se
                till att det är er de hittar.
            </Paragraph>
            <Paragraph style={{ alignSelf: "center" }}>
                SEO (sökmotoroptimering) handlar om att göra er hemsida,{" "}
                {formData.domainName}, så relevant och användarvänlig som
                möjligt, både för besökare och för sökmotorer som Google. Det är
                en långsiktig investering som bygger förtroende och skapar en
                stadig ström av relevanta besökare – de som aktivt letar efter
                det ni gör bäst.
            </Paragraph>
            <Paragraph>
                Denna plan är ett första utkast som belyser de områden vi ser
                störst potential i. Den ger en tydlig vägkarta för hur vi kan
                arbeta tillsammans under det kommande året för att nå era mål.
            </Paragraph>
            <Text style={styles.footer}>Våning 18 | Sida 2</Text>
        </Page>

        {/* Analysis */}
        <Page size="A4" style={styles.page}>
            <Heading>Var står vi idag? En första överblick</Heading>
            <Paragraph>
                För att veta vart vi ska, måste vi veta var vi börjar. Vår
                första analys ger oss insikter inom tre viktiga områden:
            </Paragraph>

            <Heading style={styles.subheadings}>
                1. Teknisk SEO (hemsidans hälsa)
            </Heading>
            <Text style={styles.boldParagraph}>Vad det är:</Text>
            <Paragraph>
                Grunden för allt. Det handlar om sidans hastighet,
                mobilvänlighet och struktur. Om Google inte kan läsa er sida
                spelar resten mindre roll.
            </Paragraph>
            <Text style={styles.boldParagraph}>Vår observation: </Text>
            <Paragraph>{observations.teknisk || "Ingen data"}</Paragraph>

            <View style={styles.divider} />

            <Heading style={styles.subheadings}>
                2. On-Page SEO (innehållets relevans)
            </Heading>
            <Text style={styles.boldParagraph}>Vad det är:</Text>
            <Paragraph>
                Hur väl innehållet på era sidor (texter, rubriker, bilder)
                matchar det era kunder söker efter.
            </Paragraph>
            <Text style={styles.boldParagraph}>Vår observation: </Text>
            <Paragraph>{observations.onpage || "Ingen data"}</Paragraph>

            <View style={styles.divider} />

            <Heading style={styles.subheadings}>
                3. Off-Page SEO (auktoritet & förtroende)
            </Heading>
            <Text style={styles.boldParagraph}>Vad det är:</Text>
            <Paragraph>
                Hur andra på internet ser på er sida. Länkar från andra
                relevanta hemsidor fungerar som rekommendationer och bygger er
                auktoritet.
            </Paragraph>
            <Text style={styles.boldParagraph}>Vår observation: </Text>
            <Paragraph>{observations.offpage || "Ingen data"}</Paragraph>

            <Text style={styles.footer}>Våning 18 | Sida 3</Text>
        </Page>
        {/* En snabb sida ger bättre användarupplevelse och rankas högre.
                
            Majoriteten av sökningar sker idag via mobilen.

            Om Google inte kan se en sida, kan den inte synas.    */}
        {/* Strategy */}
        <Page size="A4" style={styles.page}>
            <Heading>Vår strategiska plan för 12 månader</Heading>

            <Paragraph>
                Vi delar upp arbetet i fyra kvartal, vart och ett med sitt
                fokusområde. Detta gör processen tydlig och mätbar.
            </Paragraph>

            <View style={styles.divider} />

            <Heading>Kvartal 1: Grunden – Teknisk excellens</Heading>
            <Text style={{ marginBottom: 8 }}>
                <Text style={styles.label}>Fokus:</Text> Vi ser till att ert
                digitala hus är stabilt och välbyggt.
            </Text>

            <Image
                src="/images/try.png"
                style={{
                    position: "absolute",
                    top: 195,
                    right: 60,
                    width: 43, // max width
                    height: undefined, // auto height to keep aspect ratio
                }}
            />

            <Heading style={styles.subheadings_1}>
                Fokusområde: Analys & Strategiarbete
            </Heading>

            <View>
                <View style={styles.listItem}>
                    <Text style={styles.listText}>
                        <Text style={styles.bullet}>• </Text>
                        <Text style={{ fontWeight: "bold" }}>
                            SEO-audit & teknisk analys:
                        </Text>
                        <Paragraph> {observations.q1_seo_teknisk}</Paragraph>
                    </Text>
                </View>

                <View style={styles.listItem}>
                    <Text style={styles.listText}>
                        <Text style={styles.bullet}>• </Text>
                        <Text style={{ fontWeight: "bold" }}>
                            Nyckelordsanalys & Åtgärdplan:
                        </Text>
                        <Paragraph>
                            {observations.q1_nyckelord_atgard}
                        </Paragraph>
                    </Text>
                </View>

                <View style={styles.listItem}>
                    <Text style={styles.listText}>
                        <Text style={styles.bullet}>• </Text>
                        <Text style={{ fontWeight: "bold" }}>
                            Konkurrentanalys & KPI-sättning:
                        </Text>
                        <Paragraph> {observations.q1_konkurrent_kpi}</Paragraph>
                    </Text>
                </View>

                <View style={styles.listItem}>
                    <Text style={styles.listText}>
                        <Text style={styles.bullet}>• </Text>
                        <Text style={{ fontWeight: "bold" }}>
                            Spårning (GA4/GSC) & Offpage-insikter:
                        </Text>
                        <Paragraph>
                            {" "}
                            {observations.q1_spårning_offpage}
                        </Paragraph>
                    </Text>
                </View>
            </View>

            <View style={styles.divider} />

            <Heading style={styles.subheadings_1}>
                Fokusområde: On-page & Struktur
            </Heading>

            <View style={styles.listItem}>
                <Text style={styles.listText}>
                    <Text style={styles.bullet}>• </Text>
                    <Text style={{ fontWeight: "bold" }}>
                        Optimera titlar, metabeskrivningar, headings,
                        URL-struktur:
                    </Text>
                    <Paragraph>
                        {" "}
                        {observations.q1_title_meta_head_url}
                    </Paragraph>
                </Text>
            </View>

            <View style={styles.listItem}>
                <Text style={styles.listText}>
                    <Text style={styles.bullet}>• </Text>
                    <Text style={{ fontWeight: "bold" }}>
                        Skapa sajtstruktur & interna länkar:
                    </Text>
                    <Paragraph>
                        {" "}
                        {observations.q1_title_meta_head_url}
                    </Paragraph>
                </Text>
            </View>

            <View style={styles.listItem}>
                <Text style={styles.listText}>
                    <Text style={styles.bullet}>• </Text>
                    <Text style={{ fontWeight: "bold" }}>
                        Innehållsplan för 12 månader:
                    </Text>
                    <Paragraph> {observations.q1_innehållsplan}</Paragraph>
                </Text>
            </View>

            <View style={styles.listItem}>
                <Text style={styles.listText}>
                    <Text style={styles.bullet}>• </Text>
                    <Text style={{ fontWeight: "bold" }}>Offpage: </Text>
                    <Paragraph> {observations.q1_offpage}</Paragraph>
                </Text>
            </View>

            <Text style={styles.footer}>Våning 18 | Sida 4</Text>
        </Page>

        <View style={styles.divider} />

        <Page size="A4" style={styles.page}>
            <Heading>Kvartal 2: Innehåll & relevans</Heading>
            <Heading style={styles.subheadings_1}>
                Fokusområde: Innehåll & Auktoritet
            </Heading>

            <Image
                src="/images/try2.png"
                style={{
                    position: "absolute",
                    top: 50,
                    right: 50,
                    width: 64, // max width
                    height: undefined, // auto height to keep aspect ratio
                }}
            />

            <View>
                <View style={styles.listItem}>
                    <Text style={styles.listText}>
                        <Text style={styles.bullet}>• </Text>
                        <Text style={{ fontWeight: "bold" }}>
                            Publicera artiklar/guider:
                        </Text>
                        <Paragraph>
                            {" "}
                            {observations.q2_publicera_art_guide}
                        </Paragraph>
                    </Text>
                </View>

                <View style={styles.listItem}>
                    <Text style={styles.listText}>
                        <Text style={styles.bullet}>• </Text>
                        <Text style={{ fontWeight: "bold" }}>
                            Uppdatera befintligt innehåll:
                        </Text>
                        <Paragraph>
                            {observations.q2_uppdatera_innehåll}
                        </Paragraph>
                    </Text>
                </View>

                <View style={styles.listItem}>
                    <Text style={styles.listText}>
                        <Text style={styles.bullet}>• </Text>
                        <Text style={{ fontWeight: "bold" }}>
                            Bygga topical authority:
                        </Text>
                        <Paragraph>
                            {" "}
                            {observations.q2_bygga_authority}
                        </Paragraph>
                    </Text>
                </View>

                <View style={styles.listItem}>
                    <Text style={styles.listText}>
                        <Text style={styles.bullet}>• </Text>
                        <Text style={{ fontWeight: "bold" }}>
                            Starta länkstrategi & outreach:
                        </Text>
                        <Paragraph>
                            {" "}
                            {observations.q2_länkstrategi_outreach}
                        </Paragraph>
                    </Text>
                </View>

                <View style={styles.listItem}>
                    <Text style={styles.listText}>
                        <Text style={styles.bullet}>• </Text>
                        <Text style={{ fontWeight: "bold" }}>Offpage: </Text>
                        <Paragraph> {observations.q2_offpage}</Paragraph>
                    </Text>
                </View>
            </View>

            <View style={styles.divider} />
            <Text style={styles.footer}>Våning 18 | Sida 5</Text>
        </Page>

        <Page size="A4" style={styles.page}>
            <Heading>Kvartal 3: Auktoritet & förtroende</Heading>

            <Heading style={styles.subheadings_1}>
                Fokusområde: Expansion & Conversion
            </Heading>

            <Image
                src="/images/try3.png"
                style={{
                    position: "absolute",
                    top: 50,
                    right: 50,
                    width: 64, // max width
                    height: undefined, // auto height to keep aspect ratio
                }}
            />

            <View>
                <View style={styles.listItem}>
                    <Text style={styles.listText}>
                        <Text style={styles.bullet}>• </Text>
                        <Text style={{ fontWeight: "bold" }}>
                            Nya landningssidor:
                        </Text>
                        <Paragraph>
                            {" "}
                            {observations.q3_nya_landningssidor}
                        </Paragraph>
                    </Text>
                </View>

                <View style={styles.listItem}>
                    <Text style={styles.listText}>
                        <Text style={styles.bullet}>• </Text>
                        <Text style={{ fontWeight: "bold" }}>
                            Lokal SEO om relevant:{" "}
                        </Text>
                        <Paragraph>{observations.q3_lokal_seo}</Paragraph>
                    </Text>
                </View>

                <View style={styles.listItem}>
                    <Text style={styles.listText}>
                        <Text style={styles.bullet}>• </Text>
                        <Text style={{ fontWeight: "bold" }}>CRO A/B, UX:</Text>
                        <Paragraph> {observations.q3_cro}</Paragraph>
                    </Text>
                </View>

                <View style={styles.listItem}>
                    <Text style={styles.listText}>
                        <Text style={styles.bullet}>• </Text>
                        <Text style={{ fontWeight: "bold" }}>
                            Schema markup & rich results:
                        </Text>
                        <Paragraph>
                            {" "}
                            {observations.q3_schema_markup_rich_results}
                        </Paragraph>
                    </Text>
                </View>

                <View style={styles.listItem}>
                    <Text style={styles.listText}>
                        <Text style={styles.bullet}>• </Text>
                        <Text style={{ fontWeight: "bold" }}>Offpage: </Text>
                        <Paragraph> {observations.q3_offpage}</Paragraph>
                    </Text>
                </View>
            </View>
            {/* <Text>
                <Text style={styles.label}>Fokus:</Text> Vi gör er till det
                självklara valet i er bransch.
            </Text>
            <Text>
                • <Text style={styles.label}>Åtgärd:</Text> Google Business
                Profile. Varför? Kritiskt för att synas i kart-sök och för
                kunder i ert närområde.
            </Text>
            <Text>
                • <Text style={styles.label}>Åtgärd:</Text> Länkstrategi.
                Varför? Länkar är en av de starkaste signalerna till Google att
                er sida är en auktoritet.
            </Text> */}

            <View style={styles.divider} />
            <Text style={styles.footer}>Våning 18 | Sida 6</Text>
        </Page>

        <Page size="A4" style={styles.page}>
            <Heading>Kvartal 4: Analys & expansion</Heading>

            <Image
                src="/images/Kvartal4.png"
                style={{
                    position: "absolute",
                    top: 50,
                    right: 50,
                    width: 64, // max width
                    height: undefined, // auto height to keep aspect ratio
                }}
            />

            <Heading style={styles.subheadings_1}>
                Fokusområde: Skalning & Justering
            </Heading>

            <View>
                <View style={styles.listItem}>
                    <Text style={styles.listText}>
                        <Text style={styles.bullet}>• </Text>
                        <Text style={{ fontWeight: "bold" }}>
                            Utvärdera rankingar & trafik:
                        </Text>
                        <Paragraph>
                            {observations.q4_utvärdera_rankingar_trafik}
                        </Paragraph>
                    </Text>
                </View>

                <View style={styles.listItem}>
                    <Text style={styles.listText}>
                        <Text style={styles.bullet}>• </Text>
                        <Text style={{ fontWeight: "bold" }}>
                            Skapa avancerat innehåll:
                        </Text>
                        <Paragraph>
                            {observations.q4_skapa_avancerat_innehåll}
                        </Paragraph>
                    </Text>
                </View>

                <View style={styles.listItem}>
                    <Text style={styles.listText}>
                        <Text style={styles.bullet}>• </Text>
                        <Text style={{ fontWeight: "bold" }}>
                            Bygga starkare länkar:
                        </Text>
                        <Paragraph>
                            {observations.q4_bygga_starkare_länkar}
                        </Paragraph>
                    </Text>
                </View>

                <View style={styles.listItem}>
                    <Text style={styles.listText}>
                        <Text style={styles.bullet}>• </Text>
                        <Text style={{ fontWeight: "bold" }}>
                            Eventuellt utbildning för kund:
                        </Text>
                        <Paragraph>{observations.q4_utbildning_kund}</Paragraph>
                    </Text>
                </View>

                <View style={styles.listItem}>
                    <Text style={styles.listText}>
                        <Text style={styles.bullet}>• </Text>
                        <Text style={{ fontWeight: "bold" }}>Offpage: </Text>
                        <Paragraph> {observations.q4_offpage}</Paragraph>
                    </Text>
                </View>
            </View>

            <View style={styles.divider} />

            <Heading style={styles.subheadings_1}>
                Fokusområde: Utvädering & Nästa steg
            </Heading>

            <View>
                <View style={styles.listItem}>
                    <Text style={styles.listText}>
                        <Text style={styles.bullet}>• </Text>
                        <Text style={{ fontWeight: "bold" }}>
                            Årsrapport med resultat mot KPI:er:
                        </Text>
                        <Paragraph> {observations.q4_arsrapport}</Paragraph>
                    </Text>
                </View>

                <View style={styles.listItem}>
                    <Text style={styles.listText}>
                        <Text style={styles.bullet}>• </Text>
                        <Text style={{ fontWeight: "bold" }}>ROI-analys: </Text>
                        <Paragraph>{observations.q4_roi_analys}</Paragraph>
                    </Text>
                </View>

                <View style={styles.listItem}>
                    <Text style={styles.listText}>
                        <Text style={styles.bullet}>• </Text>
                        <Text style={{ fontWeight: "bold" }}>
                            Strategimöte och plan för nästa år:
                        </Text>
                        <Paragraph>
                            {observations.q4_strategimöte_plan}
                        </Paragraph>
                    </Text>
                </View>
            </View>

            {/* <Text>
                <Text style={styles.label}>Fokus:</Text> Vi mäter våra
                framgångar och planerar för fortsatt tillväxt.
            </Text>
            <Text>
                • <Text style={styles.label}>Åtgärd:</Text> Resultatanalys &
                rapportering. Varför? För att bevisa att strategin fungerar och
                hitta nya möjligheter.
            </Text>
            <Text>
                • <Text style={styles.label}>Åtgärd:</Text> Planering för nästa
                år. Varför? SEO är en ständigt pågående process, inte en
                engångsinsats.
            </Text> */}

            <Text style={styles.footer}>Våning 18 | Sida 7</Text>
        </Page>

        {/* Closing */}
        <Page size="A4" style={styles.page}>
            <Heading>Rapportering och nästa steg</Heading>
            <Paragraph>
                Transparens är A och O. Ni ska alltid veta vad vi gör och vilka
                resultat det ger. Vi föreslår månatliga rapporter som på ett
                lättförståeligt sätt visar utvecklingen i trafik och ranking,
                samt kvartalsvisa avstämningar där vi diskuterar resultaten och
                planerar framåt.
            </Paragraph>
            <Paragraph>
                Vi ser oss inte som en leverantör, utan som er partner. Er
                framgång är vår framgång.
            </Paragraph>

            <View style={styles.divider} />

            <Heading>Redo att börja resan?</Heading>
            <Paragraph>{observations.ready || "Ingen data"}</Paragraph>

            <Paragraph>Med vänliga hälsningar,</Paragraph>
            <Paragraph>Våning 18</Paragraph>
            <Paragraph>epost@dinsida.se</Paragraph>
            <Paragraph>070-123 45 67</Paragraph>

            <Text style={styles.footer}>Våning 18 | Sida 8</Text>
        </Page>
    </Document>
);

/* 
Potentialen för {formData.domainName} att växa i sökresultaten
                är stor. Låt oss boka ett möte för att diskutera denna plan i
                detalj och anpassa den fullt ut efter era unika affärsmål.
*/

export default function InformationForm() {
    //Saving variables
    const [loading, setLoading] = useState(false);
    const [readyDownload, setReadyDownload] = useState(false);
    const [formData, setFormData] = useState({
        domainName: "",
        domainLink: "",
    });
    const [favicon, setFavicon] = useState(null);
    const [observations, setObservations] = useState({});
    const [scrap, setScrap] = useState({});

    function handleEvent(e) {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    //Wait on fetching data before downloading
    const waitOnData = async () => {
        setLoading(true);
        setReadyDownload(false);
        await fetchScrap();
        await fetchObservations();
        await fetchFavicon();
        setLoading(false);
        setReadyDownload(true);
    };

    //Fetch OpenAI observation
    async function fetchObservations() {
        const res = await axios.post(
            "http://127.0.0.1:8001/api/generate-observations",
            {
                domainName: formData.domainName,
            },
            {
                timeout: 0,
            }
        );
        setObservations(res.data.observations);
    }

    //Fetch scrap info
    async function fetchScrap() {
        const res = await axios.get(
            "http://127.0.0.1:8001/api/scrape-example",
            {
                params: {
                    domainLink: formData.domainLink,
                },
            },
            {
                timeout: 0,
            }
        );
        setScrap(res.scrap);
    }

    //Fetch favicons
    async function fetchFavicon() {
        const response = await fetch(
            `/api/favicon?url=${encodeURIComponent(formData.domainLink)}`
        );
        const data = await response.json();
        setFavicon(data.favicon);
    }

    //Display layout of generating PDF file generator
    return (
        <div className="min-h-screen flex flex-col bg-gray-100 text-gray-900 p-8 space-y-6">
            <h1 className="text-3xl font-bold text-red-600 mb-4">
                Generate PDF File
            </h1>

            {/* Main Layout: Form on left, PDF preview on right */}
            <div className="flex flex-row gap-8 items-start">
                {/* Left Column - Inputs and Textareas */}
                <div className="flex flex-col space-y-4 w-1/2">
                    <input
                        type="text"
                        name="domainName"
                        placeholder="Domain Name ex: Apple, Våning 18"
                        value={formData.domainName}
                        onChange={handleEvent}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
                    />

                    <input
                        type="text"
                        name="domainLink"
                        placeholder="Domain Link ex: (https://www.microsoft.com/sv-se)"
                        value={formData.domainLink}
                        onChange={handleEvent}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
                    />

                    <button
                        onClick={waitOnData}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                        disabled={loading}
                    >
                        {loading ? "Preparing..." : "Prepare Data"}
                    </button>

                    {readyDownload && (
                        <>
                            <label>
                                Teknisk SEO Observation (AI Generated)
                            </label>
                            <textarea
                                placeholder="Edit Teknisk SEO observation..."
                                value={observations.teknisk}
                                onChange={(e) =>
                                    setObservations({
                                        ...observations,
                                        teknisk: e.target.value,
                                    })
                                }
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                            />

                            <label>
                                On-Page SEO Observation (AI Generated)
                            </label>
                            <textarea
                                placeholder="Edit On-Page SEO observation..."
                                value={observations.onpage}
                                onChange={(e) =>
                                    setObservations({
                                        ...observations,
                                        onpage: e.target.value,
                                    })
                                }
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                            />

                            <label>
                                Off-Page SEO Observation (AI Generated)
                            </label>
                            <textarea
                                placeholder="Edit Off-Page SEO observation..."
                                value={observations.offpage}
                                onChange={(e) =>
                                    setObservations({
                                        ...observations,
                                        offpage: e.target.value,
                                    })
                                }
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                            />

                            <label>Avsluts Meddelande (AI Generated)</label>
                            <textarea
                                placeholder="Edit Wrap-Up / Next Step"
                                value={observations.ready}
                                onChange={(e) =>
                                    setObservations({
                                        ...observations,
                                        ready: e.target.value,
                                    })
                                }
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                            />
                        </>
                    )}
                </div>

                {/* Right Column - PDF Preview and Downloads */}
                {readyDownload && (
                    <div className="flex flex-col flex-1 space-y-4">
                        <div className="border rounded-lg overflow-hidden shadow-md">
                            <PDFViewer
                                style={{ width: "100%", height: "80vh" }}
                            >
                                <MyPDF
                                    formData={formData}
                                    observations={observations}
                                    favicon={favicon}
                                />
                            </PDFViewer>
                        </div>

                        <PDFDownloadLink
                            document={
                                <MyPDF
                                    formData={formData}
                                    observations={observations}
                                    favicon={favicon}
                                />
                            }
                            fileName={`${formData.domainName || "report"}.pdf`}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg text-center hover:bg-red-600 transition"
                        >
                            {({ loading }) =>
                                loading ? "Generating PDF..." : "Download PDF"
                            }
                        </PDFDownloadLink>
                    </div>
                )}
            </div>
        </div>
    );
}

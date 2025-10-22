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
    pdf,
} from "@react-pdf/renderer";
import html2pdf from "html2pdf.js";
import PptxGenJS from "pptxgenjs";

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
        marginBottom: 14,
    },
    paragraph: {
        fontSize: 12,
        marginBottom: 13,
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
        marginBottom: 8,
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

const createPPT = ({ formData, observations, favicon }) => {
    const pptx = new PptxGenJS();

    // --- Page 1: Cover ---
    const cover = pptx.addSlide();

    cover.addImage({
        path: `${window.location.origin}/images/Bild1.png`,
        x: 0,
        y: 0,
        w: pptx.presLayout.width,
        h: pptx.presLayout.height,
    });

    cover.addText("Förslag på SEO-strategi & Årsplan", {
        x: 1,
        y: 1,
        fontSize: 28,
        bold: true,
        color: "FFFFFF",
    });

    if (favicon) {
        cover.addImage({ data: favicon, x: 7, y: 0.5, w: 1, h: 1 });
    }
    cover.addText(`Hej ${formData.domainName}! Låt oss växa tillsammans.`, {
        x: 1,
        y: 1.5,
        fontSize: 16,
        color: "FFFFFF",
    });
    cover.addText(
        `Tack för att ni överväger oss som er SEO-partner. I dagens digitala landskap är en stark närvaro på Google inte bara en fördel – det är en nödvändighet. När era potentiella kunder söker efter de tjänster eller produkter ni erbjuder, vill vi se till att det är er de hittar.

SEO (sökmotoroptimering) handlar om att göra er hemsida, ${formData.domainName}, så relevant och användarvänlig som möjligt, både för besökare och för sökmotorer som Google. Det är en långsiktig investering som bygger förtroende och skapar en stadig ström av relevanta besökare – de som aktivt letar efter det ni gör bäst.

Denna plan är ett första utkast som belyser de områden vi ser störst potential i. Den ger en tydlig vägkarta för hur vi kan arbeta tillsammans under det kommande året för att nå era mål.`,
        {
            x: 1,
            y: 3.5,
            fontSize: 14,
            color: "FFFFFF",
            lineSpacingMultiple: 1.2,
        }
    );

    // --- Page 2: Analys ---
    const slide2 = pptx.addSlide();

    slide2.addImage({
        path: `${window.location.origin}/images/bakgrund_2.jpg`,
        x: 0,
        y: 0,
        w: pptx.presLayout.width,
        h: pptx.presLayout.height,
    });

    slide2.addText("Var står vi idag? En första överblick", {
        x: 0.5,
        y: 0.4,
        fontSize: 22,
        bold: true,
        w: 9,
        h: 0.8,
    });

    slide2.addText(
        `För att veta vart vi ska, måste vi veta var vi börjar. Vår första analys ger oss insikter inom tre viktiga områden:`,
        { x: 0.5, y: 1.3, fontSize: 14, w: 4.5 }
    );

    slide2.addText(
        `1. Teknisk SEO (hemsidans hälsa)
Vad det är: Grunden för allt. Det handlar om sidans hastighet, mobilvänlighet och struktur. Om Google inte kan läsa er sida spelar resten mindre roll.

Vår observation: ${observations.teknisk || "Ingen data"}`,
        { x: 0.5, y: 3.4, fontSize: 14, lineSpacingMultiple: 1.1, w: 4.5 }
    );

    // --- Page 2b: Analys ---
    const slide2b = pptx.addSlide();

    slide2b.addImage({
        path: `${window.location.origin}/images/bakgrund_2.jpg`,
        x: 0,
        y: 0,
        w: pptx.presLayout.width,
        h: pptx.presLayout.height,
    });

    slide2b.addText("Var står vi idag? En första överblick", {
        x: 0.5,
        y: 0.5,
        fontSize: 22,
        bold: true,
        w: 9,
        h: 0.8,
    });

    slide2b.addText(
        `
2. On-Page SEO (innehållets relevans)

Vad det är: Hur väl innehållet på era sidor (texter, rubriker, bilder) matchar det era kunder söker efter.

Vår observation: ${observations.onpage || "Ingen data"}`,
        { x: 0.5, y: 2.5, fontSize: 14, lineSpacingMultiple: 1.1, w: 4.5 }
    );

    // --- Page 2c: Analys ---
    const slide2c = pptx.addSlide();

    slide2c.addImage({
        path: `${window.location.origin}/images/bakgrund_2.jpg`,
        x: 0,
        y: 0,
        w: pptx.presLayout.width,
        h: pptx.presLayout.height,
    });

    slide2c.addText("Var står vi idag? En första överblick", {
        x: 0.5,
        y: 0.5,
        fontSize: 22,
        bold: true,
        w: 9,
        h: 0.8,
    });

    slide2c.addText(
        `
3. Off-Page SEO (auktoritet & förtroende)

Vad det är: Hur andra på internet ser på er sida. Länkar från andra relevanta hemsidor fungerar som rekommendationer och bygger er auktoritet.

Vår observation: ${observations.offpage || "Ingen data"}`,
        { x: 0.5, y: 2.5, fontSize: 14, lineSpacingMultiple: 1.1, w: 4.5 }
    );

    // --- Page 3a: Kvartal 1 - Analys & Strategiarbete ---
    const slide3_intro = pptx.addSlide();

    slide3_intro.addImage({
        path: `${window.location.origin}/images/plan2.png`,
        x: 0,
        y: 0,
        w: pptx.presLayout.width,
        h: pptx.presLayout.height,
    });

    slide3_intro.addText(`Vår strategiska plan för 12 månader. `, {
        x: 0.5,
        y: 1.1,
        fontSize: 20,
        bold: true,
        w: 9,
        color: "FFFFFF",
    });

    slide3_intro.addText(
        `Vi delar upp arbetet i fyra kvartal, vart och ett med sitt fokusområde. 
Detta gör processen tydlig och mätbar`,
        {
            x: 0.5,
            y: 1.6,
            fontSize: 13,
            bold: true,
            w: 9,
            color: "FFFFFF",
        }
    );

    slide3_intro.addText(
        [
            {
                text: "Kvartal 1: Grunden – Teknisk excellens\n\n",
                options: { color: "b5eddc", bold: true },
            },
            {
                text: "Kvartal 2: Innehåll & relevans\n\n",
                options: { color: "69b898", bold: true },
            },
            {
                text: "Kvartal 3: Auktoritet & förtroende\n\n",
                options: { color: "559192", bold: true },
            },
            {
                text: "Kvartal 4: Analys & expansion\n\n",
                options: { color: "90d1bf", bold: true },
            },
        ],
        {
            x: 0.5,
            y: 3.5,
            fontSize: 13,
            lineSpacingMultiple: 1.2,
            w: 9,
        }
    );

    // --- Page 3a: Kvartal 1 - Analys & Strategiarbete ---
    const slide3a = pptx.addSlide();
    slide3a.addImage({
        path: `${window.location.origin}/images/n1.png`,
        x: 0,
        y: 0,
        w: pptx.presLayout.width,
        h: pptx.presLayout.height,
    });
    slide3a.addText(
        [
            { text: "Kvartal 1", options: { color: "489C84", bold: true } },
            {
                text: ": Grunden – Teknisk excellens",
                options: { color: "000000", bold: true },
            },
        ],
        {
            x: 0.5,
            y: 1,
            fontSize: 22,
            bold: true,
        }
    );

    slide3a.addText("Fokusområde: Analys & Strategiarbete:", {
        x: 0.5,
        y: 1.3,
        fontSize: 17,
        color: "000000",
        bold: true,
    });
    slide3a.addText(
        [
            {
                text: "• SEO-audit & teknisk analys: ",
                options: { color: "489C84", bold: true },
            },
            {
                text: `${observations.q1_seo_teknisk}\n`,
                options: { color: "000000" },
            },
            {
                text: "• Nyckelordsanalys & Åtgärdplan: ",
                options: { color: "489C84", bold: true },
            },
            {
                text: `${observations.q1_nyckelord_atgard}\n`,
                options: { color: "000000" },
            },
            {
                text: "• Konkurrentanalys & KPI-sättning: ",
                options: { color: "489C84", bold: true },
            },
            {
                text: `${observations.q1_konkurrent_kpi}\n`,
                options: { color: "000000" },
            },
            {
                text: "• Spårning (GA4/GSC) & Offpage-insikter: ",
                options: { color: "489C84", bold: true },
            },
            {
                text: `${observations.q1_spårning_offpage}`,
                options: { color: "000000" },
            },
        ],
        { x: 0.5, y: 3.2, fontSize: 13, lineSpacingMultiple: 1.3, w: 9 }
    );

    // --- Page 3b: Kvartal 1 - On-page & Struktur ---
    const slide3b = pptx.addSlide();
    slide3b.addImage({
        path: `${window.location.origin}/images/n1.png`,
        x: 0,
        y: 0,
        w: pptx.presLayout.width,
        h: pptx.presLayout.height,
    });
    slide3b.addText(
        [
            { text: "Kvartal 1", options: { color: "489C84", bold: true } },
            {
                text: ": Grunden – Teknisk excellens",
                options: { color: "000000", bold: true },
            },
        ],
        {
            x: 0.5,
            y: 1,
            fontSize: 22,
            bold: true,
        }
    );

    slide3b.addText("Fokusområde: On-page & Struktur:", {
        x: 0.5,
        y: 1.3,
        fontSize: 17,
        color: "000000",
        bold: true,
    });

    slide3b.addText(
        [
            {
                text: "• Optimera titlar, metabeskrivningar, headings, URL-struktur: ",
                options: { color: "489C84", bold: true },
            },
            {
                text: `${observations.q1_title_meta_head_url}\n`,
                options: { color: "000000" },
            },
            {
                text: "• Skapa sajtstruktur & interna länkar: ",
                options: { color: "489C84", bold: true },
            },
            {
                text: `${observations.q1_title_meta_head_url}\n`,
                options: { color: "000000" },
            },
            {
                text: "• Innehållsplan för 12 månader: ",
                options: { color: "489C84", bold: true },
            },
            {
                text: `${observations.q1_innehallsplan}\n`,
                options: { color: "000000" },
            },
            { text: "• Offpage: ", options: { color: "489C84", bold: true } },
            {
                text: `${observations.q1_offpage}`,
                options: { color: "000000" },
            },
        ],
        { x: 0.5, y: 3, fontSize: 13, lineSpacingMultiple: 1.3, w: 9 }
    );

    // --- Page 4: Kvartal 2 ---
    const slide4 = pptx.addSlide();
    slide4.addImage({
        path: `${window.location.origin}/images/n2.png`,
        x: 0,
        y: 0,
        w: pptx.presLayout.width,
        h: pptx.presLayout.height,
    });
    slide4.addText(
        [
            { text: "Kvartal 2", options: { color: "489C84", bold: true } },
            {
                text: ": Innehåll & relevans",
                options: { color: "000000", bold: true },
            },
        ],
        {
            x: 0.5,
            y: 1,
            fontSize: 22,
            bold: true,
        }
    );

    slide4.addText("Fokusområde: Innehåll & Auktoritet:", {
        x: 0.5,
        y: 1.3,
        fontSize: 17,
        color: "000000",
        bold: true,
    });

    slide4.addText(
        [
            {
                text: "• Publicera artiklar/guider: ",
                options: { color: "489C84", bold: true },
            },
            {
                text: `${observations.q2_publicera_art_guide}\n`,
                options: { color: "000000" },
            },
            {
                text: "• Uppdatera befintligt innehåll: ",
                options: { color: "489C84", bold: true },
            },
            {
                text: `${observations.q2_uppdatera_innehall}\n`,
                options: { color: "000000" },
            },
            {
                text: "• Bygga topical authority: ",
                options: { color: "489C84", bold: true },
            },
            {
                text: `${observations.q2_bygga_authority}\n`,
                options: { color: "000000" },
            },
            {
                text: "• Starta länkstrategi & outreach: ",
                options: { color: "489C84", bold: true },
            },
            {
                text: `${observations.q2_lankstrategi_outreach}\n`,
                options: { color: "000000" },
            },
            { text: "• Offpage: ", options: { color: "489C84", bold: true } },
            {
                text: `${observations.q2_offpage}`,
                options: { color: "000000" },
            },
        ],
        { x: 0.5, y: 3, fontSize: 13, lineSpacingMultiple: 1.3, w: 9 }
    );

    // --- Page 5: Kvartal 3 ---
    const slide5 = pptx.addSlide();
    slide5.addImage({
        path: `${window.location.origin}/images/n3.png`,
        x: 0,
        y: 0,
        w: pptx.presLayout.width,
        h: pptx.presLayout.height,
    });
    slide5.addText(
        [
            { text: "Kvartal 3", options: { color: "489C84", bold: true } },
            {
                text: ": Auktoritet & förtroende",
                options: { color: "000000", bold: true },
            },
        ],
        {
            x: 0.5,
            y: 1,
            fontSize: 22,
            bold: true,
        }
    );

    slide5.addText("Fokusområde: Expansion & Conversion:", {
        x: 0.5,
        y: 1.3,
        fontSize: 17,
        color: "000000",
        bold: true,
    });

    slide5.addText(
        [
            {
                text: "• Nya landningssidor: ",
                options: { color: "489C84", bold: true },
            },
            {
                text: `${observations.q3_nya_landningssidor}\n`,
                options: { color: "000000" },
            },
            {
                text: "• Lokal SEO om relevant: ",
                options: { color: "489C84", bold: true },
            },
            {
                text: `${observations.q3_lokal_seo}\n`,
                options: { color: "000000" },
            },
            {
                text: "• CRO A/B, UX: ",
                options: { color: "489C84", bold: true },
            },
            { text: `${observations.q3_cro}\n`, options: { color: "000000" } },
            {
                text: "• Schema markup & rich results: ",
                options: { color: "489C84", bold: true },
            },
            {
                text: `${observations.q3_schema_markup_rich_results}\n`,
                options: { color: "000000" },
            },
            { text: "• Offpage: ", options: { color: "489C84", bold: true } },
            {
                text: `${observations.q3_offpage}`,
                options: { color: "000000" },
            },
        ],
        { x: 0.5, y: 3.2, fontSize: 13, lineSpacingMultiple: 1.3, w: 9 }
    );

    // --- Page 6: Kvartal 4 ---
    const slide6 = pptx.addSlide();
    slide6.addImage({
        path: `${window.location.origin}/images/n4.png`,
        x: 0,
        y: 0,
        w: pptx.presLayout.width,
        h: pptx.presLayout.height,
    });

    slide6.addText(
        [
            { text: "Kvartal 4", options: { color: "489C84", bold: true } },
            {
                text: ": Analys & expansion",
                options: { color: "000000", bold: true },
            },
        ],
        {
            x: 0.5,
            y: 1,
            fontSize: 22,
            bold: true,
        }
    );

    slide6.addText("Fokusområde: Skalning & Justering:", {
        x: 0.5,
        y: 1.3,
        fontSize: 17,
        color: "000000",
        bold: true,
    });

    slide6.addText(
        [
            {
                text: "• Utvärdera rankingar & trafik: ",
                options: { color: "489C84", bold: true },
            },
            {
                text: `${observations.q4_utvärdera_rankingar_trafik}\n`,
                options: { color: "000000" },
            },
            {
                text: "• Skapa avancerat innehåll: ",
                options: { color: "489C84", bold: true },
            },
            {
                text: `${observations.q4_skapa_avancerat_innehåll}\n`,
                options: { color: "000000" },
            },
            {
                text: "• Bygga starkare länkar: ",
                options: { color: "489C84", bold: true },
            },
            {
                text: `${observations.q4_bygga_starkare_länkar}\n`,
                options: { color: "000000" },
            },
            {
                text: "• Eventuellt utbildning för kund: ",
                options: { color: "489C84", bold: true },
            },
            {
                text: `${observations.q4_utbildning_kund}\n`,
                options: { color: "000000" },
            },
            { text: "• Offpage: ", options: { color: "489C84", bold: true } },
            {
                text: `${observations.q4_offpage}`,
                options: { color: "000000" },
            },
        ],
        { x: 0.5, y: 3.2, fontSize: 13, lineSpacingMultiple: 1.3, w: 9 }
    );

    // --- Page 6b: Kvartal 4 - Utvärdering ---
    const slide6b = pptx.addSlide();
    slide6b.addImage({
        path: `${window.location.origin}/images/n4.png`,
        x: 0,
        y: 0,
        w: pptx.presLayout.width,
        h: pptx.presLayout.height,
    });
    slide6b.addText(
        [
            { text: "Kvartal 4", options: { color: "489C84", bold: true } },
            {
                text: ": Analys & expansion",
                options: { color: "000000", bold: true },
            },
        ],
        {
            x: 0.5,
            y: 1,
            fontSize: 22,
            bold: true,
        }
    );

    slide6b.addText("Fokusområde: Utvärdering & Nästa steg:", {
        x: 0.5,
        y: 1.3,
        fontSize: 17,
        color: "000000",
        bold: true,
    });

    slide6b.addText(
        [
            {
                text: "• Årsrapport med resultat mot KPI:er: ",
                options: { color: "489C84", bold: true },
            },
            {
                text: `${observations.q4_arsrapport}\n`,
                options: { color: "000000" },
            },
            {
                text: "• ROI-analys: ",
                options: { color: "489C84", bold: true },
            },
            {
                text: `${observations.q4_roi_analys}\n`,
                options: { color: "000000" },
            },
            {
                text: "• Strategimöte och plan för nästa år: ",
                options: { color: "489C84", bold: true },
            },
            {
                text: `${observations.q4_strategimöte_plan}`,
                options: { color: "000000" },
            },
        ],
        { x: 0.5, y: 3, fontSize: 13, lineSpacingMultiple: 1.3, w: 9 }
    );

    // --- Page 7: Closing ---
    const slide7 = pptx.addSlide();

    slide7.addImage({
        path: `${window.location.origin}/images/endD.png`,
        x: 0,
        y: 0,
        w: pptx.presLayout.width,
        h: pptx.presLayout.height,
    });

    slide7.addText("Rapportering och nästa steg", {
        x: 0.5,
        y: 0.5,
        fontSize: 22,
        bold: true,
        color: "489C84",
    });
    slide7.addText(
        `Transparens är A och O. Ni ska alltid veta vad vi gör och vilka resultat det ger. Vi föreslår månatliga rapporter som på ett lättförståeligt sätt visar utvecklingen i trafik och ranking, samt kvartalsvisa avstämningar där vi diskuterar resultaten och planerar framåt.

Vi ser oss inte som en leverantör, utan som er partner. Er framgång är vår framgång.

Redo att börja resan?
${observations.ready || "Ingen data"}

Med vänliga hälsningar,
Våning 18
epost@dinsida.se
070-123 45 67`,
        {
            x: 0.5,
            y: 3,
            fontSize: 13,
            lineSpacingMultiple: 1.2,
            color: "000000",
        }
    );

    // --- Save file ---
    pptx.writeFile({ fileName: `SEO_Strategi_${formData.domainName}.pptx` });
};

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
                            {" "}
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
                    <Paragraph> {observations.q1_innehallsplan}</Paragraph>
                </Text>
            </View>

            <View style={styles.listItem}>
                <Text style={styles.listText}>
                    <Text style={styles.bullet}>• </Text>
                    <Text style={{ fontWeight: "bold" }}>Offpage:</Text>
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
                            {" "}
                            {observations.q2_uppdatera_innehall}
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
                            {observations.q2_lankstrategi_outreach}
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
                            {" "}
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
                            {" "}
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
                            {" "}
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
                        <Paragraph>
                            {" "}
                            {observations.q4_utbildning_kund}
                        </Paragraph>
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
                        <Paragraph> {observations.q4_roi_analys}</Paragraph>
                    </Text>
                </View>

                <View style={styles.listItem}>
                    <Text style={styles.listText}>
                        <Text style={styles.bullet}>• </Text>
                        <Text style={{ fontWeight: "bold" }}>
                            Strategimöte och plan för nästa år:
                        </Text>
                        <Paragraph>
                            {" "}
                            {observations.q4_strategimöte_plan}
                        </Paragraph>
                    </Text>
                </View>
            </View>

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

    //Fetch scrap info
    async function fetchScrap() {
        try {
            const res = await axios.get(
                "http://127.0.0.1:8001/api/scrape-example",
                { params: { domainLink: formData.domainLink } }
            );
            setScrap(res.data); // rätt
        } catch (error) {
            console.error("Error scraping:", error);
        }
    }

    //Fetch OpenAI observation
    async function fetchObservations() {
        const res = await axios.post(
            "http://127.0.0.1:8001/api/generate-observations",
            {
                domainName: formData.domainName,
                domainLink: formData.domainLink,
                scrapedData: scrap,
            },
            {
                timeout: 0,
            }
        );
        setObservations(res.data.observations);
    }

    //Fetch favicons
    async function fetchFavicon() {
        const response = await fetch(
            `/api/favicon?url=${encodeURIComponent(formData.domainLink)}`
        );
        const data = await response.json();
        setFavicon(data.favicon);
    }

    const handleDownloadPDF = async () => {
        // Use the current React state, which has the latest content
        const blob = await pdf(
            <MyPDF
                formData={formData}
                observations={observations}
                favicon={favicon}
            />
        ).toBlob();

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${formData.domainName || "report"}.pdf`;
        link.click();
    };

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
                </div>

                {/* Right Column - Editable HTML Preview */}
                {readyDownload && (
                    <div className="flex flex-col flex-1 space-y-4">
                        <div
                            id="pdf-preview"
                            className="w-full min-h-[80vh] bg-white shadow-lg p-12 border border-gray-300 overflow-auto"
                            style={{
                                fontFamily: "Helvetica, Arial, sans-serif",
                            }}
                        >
                            {/* Förstasidan */}
                            <h1
                                className="text-2xl font-bold text-center mb-4"
                                contentEditable
                                suppressContentEditableWarning={true}
                                onBlur={(e) =>
                                    setFormData({
                                        ...formData,
                                        title: e.currentTarget.textContent,
                                    })
                                }
                            >
                                {formData.title ||
                                    "Förslag på SEO-strategi & Årsplan"}
                            </h1>

                            {favicon && (
                                <img
                                    src={favicon}
                                    style={{
                                        width: 64,
                                        height: 64,
                                        display: "block",
                                        margin: "0 auto",
                                    }}
                                />
                            )}

                            <p
                                className="text-center mb-8"
                                contentEditable
                                suppressContentEditableWarning={true}
                                onBlur={(e) =>
                                    setFormData({
                                        ...formData,
                                        domainIntro:
                                            e.currentTarget.textContent,
                                    })
                                }
                            >
                                Hej {formData.domainName}! Låt oss växa
                                tillsammans.
                            </p>

                            <p
                                contentEditable
                                suppressContentEditableWarning={true}
                                style={{ marginBottom: "1rem" }}
                                onBlur={(e) =>
                                    setObservations({
                                        ...observations,
                                        intro1: e.currentTarget.textContent,
                                    })
                                }
                            >
                                Tack för att ni överväger oss som er
                                SEO-partner. I dagens digitala landskap är en
                                stark närvaro på Google inte bara en fördel –
                                det är en nödvändighet. När era potentiella
                                kunder söker efter de tjänster eller produkter
                                ni erbjuder, vill vi se till att det är er de
                                hittar.
                            </p>

                            <p
                                contentEditable
                                suppressContentEditableWarning={true}
                                style={{
                                    textAlign: "left",
                                    marginBottom: "1rem",
                                }}
                                onBlur={(e) =>
                                    setObservations({
                                        ...observations,
                                        intro2: e.currentTarget.textContent,
                                    })
                                }
                            >
                                SEO (sökmotoroptimering) handlar om att göra er
                                hemsida, {formData.domainName}, så relevant och
                                användarvänlig som möjligt, både för besökare
                                och för sökmotorer som Google. Det är en
                                långsiktig investering som bygger förtroende och
                                skapar en stadig ström av relevanta besökare –
                                de som aktivt letar efter det ni gör bäst.
                            </p>

                            <p
                                contentEditable
                                suppressContentEditableWarning={true}
                                onBlur={(e) =>
                                    setObservations({
                                        ...observations,
                                        intro3: e.currentTarget.textContent,
                                    })
                                }
                            >
                                Denna plan är ett första utkast som belyser de
                                områden vi ser störst potential i. Den ger en
                                tydlig vägkarta för hur vi kan arbeta
                                tillsammans under det kommande året för att nå
                                era mål.
                            </p>

                            <hr className="my-6" />

                            {/* Analys */}
                            <h2
                                className="text-xl font-semibold mt-6"
                                contentEditable
                                suppressContentEditableWarning={true}
                                onBlur={(e) =>
                                    setObservations({
                                        ...observations,
                                        heading_analysis:
                                            e.currentTarget.textContent,
                                    })
                                }
                            >
                                Var står vi idag? En första överblick
                            </h2>

                            <p
                                contentEditable
                                suppressContentEditableWarning={true}
                                onBlur={(e) =>
                                    setObservations({
                                        ...observations,
                                        analysis_intro:
                                            e.currentTarget.textContent,
                                    })
                                }
                            >
                                För att veta vart vi ska, måste vi veta var vi
                                börjar. Vår första analys ger oss insikter inom
                                tre viktiga områden:
                            </p>

                            {/* Teknisk SEO */}
                            <h3
                                className="text-lg font-semibold mt-4"
                                contentEditable
                                suppressContentEditableWarning={true}
                                onBlur={(e) =>
                                    setObservations({
                                        ...observations,
                                        heading_teknisk:
                                            e.currentTarget.textContent,
                                    })
                                }
                            >
                                1. Teknisk SEO (hemsidans hälsa)
                            </h3>
                            <strong
                                contentEditable
                                suppressContentEditableWarning={true}
                                onBlur={(e) =>
                                    setObservations({
                                        ...observations,
                                        teknisk_vad:
                                            e.currentTarget.textContent,
                                    })
                                }
                            >
                                Vad det är:
                            </strong>
                            <p
                                contentEditable
                                suppressContentEditableWarning={true}
                                onBlur={(e) =>
                                    setObservations({
                                        ...observations,
                                        teknisk_desc:
                                            e.currentTarget.textContent,
                                    })
                                }
                            >
                                Grunden för allt. Det handlar om sidans
                                hastighet, mobilvänlighet och struktur. Om
                                Google inte kan läsa er sida spelar resten
                                mindre roll.
                            </p>
                            <strong
                                contentEditable
                                suppressContentEditableWarning={true}
                                onBlur={(e) =>
                                    setObservations({
                                        ...observations,
                                        teknisk_obs_label:
                                            e.currentTarget.textContent,
                                    })
                                }
                            >
                                Vår observation:
                            </strong>
                            <p
                                contentEditable
                                suppressContentEditableWarning={true}
                                onBlur={(e) =>
                                    setObservations({
                                        ...observations,
                                        teknisk: e.currentTarget.textContent,
                                    })
                                }
                            >
                                {observations.teknisk || "Ingen data"}
                            </p>

                            {/* On-Page SEO */}
                            <h3
                                className="text-lg font-semibold mt-4"
                                contentEditable
                                suppressContentEditableWarning={true}
                                onBlur={(e) =>
                                    setObservations({
                                        ...observations,
                                        heading_onpage:
                                            e.currentTarget.textContent,
                                    })
                                }
                            >
                                2. On-Page SEO (innehållets relevans)
                            </h3>
                            <strong
                                contentEditable
                                suppressContentEditableWarning={true}
                                onBlur={(e) =>
                                    setObservations({
                                        ...observations,
                                        onpage_vad: e.currentTarget.textContent,
                                    })
                                }
                            >
                                Vad det är:
                            </strong>
                            <p
                                contentEditable
                                suppressContentEditableWarning={true}
                                onBlur={(e) =>
                                    setObservations({
                                        ...observations,
                                        onpage_desc:
                                            e.currentTarget.textContent,
                                    })
                                }
                            >
                                Hur väl innehållet på era sidor (texter,
                                rubriker, bilder) matchar det era kunder söker
                                efter.
                            </p>
                            <strong
                                contentEditable
                                suppressContentEditableWarning={true}
                                onBlur={(e) =>
                                    setObservations({
                                        ...observations,
                                        onpage_obs_label:
                                            e.currentTarget.textContent,
                                    })
                                }
                            >
                                Vår observation:
                            </strong>
                            <p
                                contentEditable
                                suppressContentEditableWarning={true}
                                onBlur={(e) =>
                                    setObservations({
                                        ...observations,
                                        onpage: e.currentTarget.textContent,
                                    })
                                }
                            >
                                {observations.onpage || "Ingen data"}
                            </p>

                            {/* Off-Page SEO */}
                            <h3
                                className="text-lg font-semibold mt-4"
                                contentEditable
                                suppressContentEditableWarning={true}
                                onBlur={(e) =>
                                    setObservations({
                                        ...observations,
                                        heading_offpage:
                                            e.currentTarget.textContent,
                                    })
                                }
                            >
                                3. Off-Page SEO (auktoritet & förtroende)
                            </h3>
                            <strong
                                contentEditable
                                suppressContentEditableWarning={true}
                                onBlur={(e) =>
                                    setObservations({
                                        ...observations,
                                        offpage_vad:
                                            e.currentTarget.textContent,
                                    })
                                }
                            >
                                Vad det är:
                            </strong>
                            <p
                                contentEditable
                                suppressContentEditableWarning={true}
                                onBlur={(e) =>
                                    setObservations({
                                        ...observations,
                                        offpage_desc:
                                            e.currentTarget.textContent,
                                    })
                                }
                            >
                                Hur andra på internet ser på er sida. Länkar
                                från andra relevanta hemsidor fungerar som
                                rekommendationer och bygger er auktoritet.
                            </p>
                            <strong
                                contentEditable
                                suppressContentEditableWarning={true}
                                onBlur={(e) =>
                                    setObservations({
                                        ...observations,
                                        offpage_obs_label:
                                            e.currentTarget.textContent,
                                    })
                                }
                            >
                                Vår observation:
                            </strong>
                            <p
                                contentEditable
                                suppressContentEditableWarning={true}
                                onBlur={(e) =>
                                    setObservations({
                                        ...observations,
                                        offpage: e.currentTarget.textContent,
                                    })
                                }
                            >
                                {observations.offpage || "Ingen data"}
                            </p>

                            <hr className="my-6" />

                            {/* Strategiska kvartal */}
                            {/* Kvartal 1 */}
                            <h2
                                contentEditable
                                suppressContentEditableWarning={true}
                                onBlur={(e) =>
                                    setObservations({
                                        ...observations,
                                        heading_q1: e.currentTarget.textContent,
                                    })
                                }
                                className="mb-6"
                            >
                                <strong>
                                    Kvartal 1: Grunden – Teknisk excellens
                                </strong>
                            </h2>

                            <h3 className="mb-2">
                                <strong>
                                    Fokusområde: Analys & Strategiarbete
                                </strong>
                            </h3>
                            <ul className="ml-6 mb-6 space-y-2">
                                <li>
                                    <strong>SEO-audit & teknisk analys:</strong>{" "}
                                    <span
                                        contentEditable
                                        suppressContentEditableWarning={true}
                                        onBlur={(e) =>
                                            setObservations({
                                                ...observations,
                                                q1_seo_teknisk:
                                                    e.currentTarget.textContent,
                                            })
                                        }
                                        className="ml-1"
                                    >
                                        {observations.q1_seo_teknisk ||
                                            "Ingen data"}
                                    </span>
                                </li>
                                <li>
                                    <strong>
                                        Nyckelordsanalys & Åtgärdplan:
                                    </strong>{" "}
                                    <span
                                        contentEditable
                                        suppressContentEditableWarning={true}
                                        onBlur={(e) =>
                                            setObservations({
                                                ...observations,
                                                q1_nyckelord_atgard:
                                                    e.currentTarget.textContent,
                                            })
                                        }
                                        className="ml-1"
                                    >
                                        {observations.q1_nyckelord_atgard ||
                                            "Ingen data"}
                                    </span>
                                </li>
                                <li>
                                    <strong>
                                        Konkurrentanalys & KPI-sättning:
                                    </strong>{" "}
                                    <span
                                        contentEditable
                                        suppressContentEditableWarning={true}
                                        onBlur={(e) =>
                                            setObservations({
                                                ...observations,
                                                q1_konkurrent_kpi:
                                                    e.currentTarget.textContent,
                                            })
                                        }
                                        className="ml-1"
                                    >
                                        {observations.q1_konkurrent_kpi ||
                                            "Ingen data"}
                                    </span>
                                </li>
                                <li>
                                    <strong>
                                        Spårning (GA4/GSC) & Offpage-insikter:
                                    </strong>{" "}
                                    <span
                                        contentEditable
                                        suppressContentEditableWarning={true}
                                        onBlur={(e) =>
                                            setObservations({
                                                ...observations,
                                                q1_spårning_offpage:
                                                    e.currentTarget.textContent,
                                            })
                                        }
                                        className="ml-1"
                                    >
                                        {observations.q1_spårning_offpage ||
                                            "Ingen data"}
                                    </span>
                                </li>
                            </ul>

                            <h3 className="mb-2">
                                <strong>Fokusområde: On-page & Struktur</strong>
                            </h3>
                            <ul className="ml-6 mb-8 space-y-2">
                                <li>
                                    <strong>
                                        Optimera titlar, metabeskrivningar,
                                        headings, URL-struktur:
                                    </strong>{" "}
                                    <span
                                        contentEditable
                                        suppressContentEditableWarning={true}
                                        onBlur={(e) =>
                                            setObservations({
                                                ...observations,
                                                q1_title_meta_head_url:
                                                    e.currentTarget.textContent,
                                            })
                                        }
                                        className="ml-1"
                                    >
                                        {observations.q1_title_meta_head_url ||
                                            "Ingen data"}
                                    </span>
                                </li>
                                <li>
                                    <strong>
                                        Skapa sajtstruktur & interna länkar:
                                    </strong>{" "}
                                    <span
                                        contentEditable
                                        suppressContentEditableWarning={true}
                                        onBlur={(e) =>
                                            setObservations({
                                                ...observations,
                                                q1_sajt_lankar:
                                                    e.currentTarget.textContent,
                                            })
                                        }
                                        className="ml-1"
                                    >
                                        {observations.q1_sajt_lankar ||
                                            "Ingen data"}
                                    </span>
                                </li>
                                <li>
                                    <strong>
                                        Innehållsplan för 12 månader:
                                    </strong>{" "}
                                    <span
                                        contentEditable
                                        suppressContentEditableWarning={true}
                                        onBlur={(e) =>
                                            setObservations({
                                                ...observations,
                                                q1_innehallsplan:
                                                    e.currentTarget.textContent,
                                            })
                                        }
                                        className="ml-1"
                                    >
                                        {observations.q1_innehallsplan ||
                                            "Ingen data"}
                                    </span>
                                </li>
                                <li>
                                    <strong>Offpage:</strong>{" "}
                                    <span
                                        contentEditable
                                        suppressContentEditableWarning={true}
                                        onBlur={(e) =>
                                            setObservations({
                                                ...observations,
                                                q1_offpage:
                                                    e.currentTarget.textContent,
                                            })
                                        }
                                        className="ml-1"
                                    >
                                        {observations.q1_offpage ||
                                            "Ingen data"}
                                    </span>
                                </li>
                            </ul>

                            {/* Kvartal 2 */}
                            <h2
                                contentEditable
                                suppressContentEditableWarning={true}
                                onBlur={(e) =>
                                    setObservations({
                                        ...observations,
                                        heading_q2: e.currentTarget.textContent,
                                    })
                                }
                                className="mb-6"
                            >
                                <strong>Kvartal 2: Innehåll & relevans</strong>
                            </h2>

                            <h3 className="mb-2">
                                <strong>
                                    Fokusområde: Innehåll & Auktoritet
                                </strong>
                            </h3>
                            <ul className="ml-6 mb-6 space-y-2">
                                <li>
                                    <strong>Publicera artiklar/guider:</strong>{" "}
                                    <span
                                        contentEditable
                                        suppressContentEditableWarning={true}
                                        onBlur={(e) =>
                                            setObservations({
                                                ...observations,
                                                q2_publicera_art_guide:
                                                    e.currentTarget.textContent,
                                            })
                                        }
                                        className="ml-1"
                                    >
                                        {observations.q2_publicera_art_guide ||
                                            "Ingen data"}
                                    </span>
                                </li>
                                <li>
                                    <strong>
                                        Uppdatera befintligt innehåll:
                                    </strong>{" "}
                                    <span
                                        contentEditable
                                        suppressContentEditableWarning={true}
                                        onBlur={(e) =>
                                            setObservations({
                                                ...observations,
                                                q2_uppdatera_innehall:
                                                    e.currentTarget.textContent,
                                            })
                                        }
                                        className="ml-1"
                                    >
                                        {observations.q2_uppdatera_innehall ||
                                            "Ingen data"}
                                    </span>
                                </li>
                                <li>
                                    <strong>Bygga topical authority:</strong>{" "}
                                    <span
                                        contentEditable
                                        suppressContentEditableWarning={true}
                                        onBlur={(e) =>
                                            setObservations({
                                                ...observations,
                                                q2_bygga_authority:
                                                    e.currentTarget.textContent,
                                            })
                                        }
                                        className="ml-1"
                                    >
                                        {observations.q2_bygga_authority ||
                                            "Ingen data"}
                                    </span>
                                </li>
                                <li>
                                    <strong>
                                        Starta länkstrategi & outreach:
                                    </strong>{" "}
                                    <span
                                        contentEditable
                                        suppressContentEditableWarning={true}
                                        onBlur={(e) =>
                                            setObservations({
                                                ...observations,
                                                q2_lankstrategi_outreach:
                                                    e.currentTarget.textContent,
                                            })
                                        }
                                        className="ml-1"
                                    >
                                        {observations.q2_lankstrategi_outreach ||
                                            "Ingen data"}
                                    </span>
                                </li>
                                <li>
                                    <strong>Offpage:</strong>{" "}
                                    <span
                                        contentEditable
                                        suppressContentEditableWarning={true}
                                        onBlur={(e) =>
                                            setObservations({
                                                ...observations,
                                                q2_offpage:
                                                    e.currentTarget.textContent,
                                            })
                                        }
                                        className="ml-1"
                                    >
                                        {observations.q2_offpage ||
                                            "Ingen data"}
                                    </span>
                                </li>
                            </ul>

                            {/* Kvartal 3 */}
                            <h2
                                contentEditable
                                suppressContentEditableWarning={true}
                                onBlur={(e) =>
                                    setObservations({
                                        ...observations,
                                        heading_q3: e.currentTarget.textContent,
                                    })
                                }
                                className="mb-6"
                            >
                                <strong>
                                    Kvartal 3: Auktoritet & förtroende
                                </strong>
                            </h2>

                            <h3 className="mb-2">
                                <strong>
                                    Fokusområde: Expansion & Conversion
                                </strong>
                            </h3>
                            <ul className="ml-6 mb-6 space-y-2">
                                <li>
                                    <strong>Nya landningssidor:</strong>{" "}
                                    <span
                                        contentEditable
                                        suppressContentEditableWarning={true}
                                        onBlur={(e) =>
                                            setObservations({
                                                ...observations,
                                                q3_nya_landningssidor:
                                                    e.currentTarget.textContent,
                                            })
                                        }
                                        className="ml-1"
                                    >
                                        {observations.q3_nya_landningssidor ||
                                            "Ingen data"}
                                    </span>
                                </li>
                                <li>
                                    <strong>Lokal SEO om relevant:</strong>{" "}
                                    <span
                                        contentEditable
                                        suppressContentEditableWarning={true}
                                        onBlur={(e) =>
                                            setObservations({
                                                ...observations,
                                                q3_lokal_seo:
                                                    e.currentTarget.textContent,
                                            })
                                        }
                                        className="ml-1"
                                    >
                                        {observations.q3_lokal_seo ||
                                            "Ingen data"}
                                    </span>
                                </li>
                                <li>
                                    <strong>CRO A/B, UX:</strong>{" "}
                                    <span
                                        contentEditable
                                        suppressContentEditableWarning={true}
                                        onBlur={(e) =>
                                            setObservations({
                                                ...observations,
                                                q3_cro: e.currentTarget
                                                    .textContent,
                                            })
                                        }
                                        className="ml-1"
                                    >
                                        {observations.q3_cro || "Ingen data"}
                                    </span>
                                </li>
                                <li>
                                    <strong>
                                        Schema markup & rich results:
                                    </strong>{" "}
                                    <span
                                        contentEditable
                                        suppressContentEditableWarning={true}
                                        onBlur={(e) =>
                                            setObservations({
                                                ...observations,
                                                q3_schema_markup_rich_results:
                                                    e.currentTarget.textContent,
                                            })
                                        }
                                        className="ml-1"
                                    >
                                        {observations.q3_schema_markup_rich_results ||
                                            "Ingen data"}
                                    </span>
                                </li>
                                <li>
                                    <strong>Offpage:</strong>{" "}
                                    <span
                                        contentEditable
                                        suppressContentEditableWarning={true}
                                        onBlur={(e) =>
                                            setObservations({
                                                ...observations,
                                                q3_offpage:
                                                    e.currentTarget.textContent,
                                            })
                                        }
                                        className="ml-1"
                                    >
                                        {observations.q3_offpage ||
                                            "Ingen data"}
                                    </span>
                                </li>
                            </ul>

                            {/* Kvartal 4 */}
                            <h2
                                contentEditable
                                suppressContentEditableWarning={true}
                                onBlur={(e) =>
                                    setObservations({
                                        ...observations,
                                        heading_q4: e.currentTarget.textContent,
                                    })
                                }
                                className="mb-6"
                            >
                                <strong>Kvartal 4: Analys & expansion</strong>
                            </h2>

                            <h3 className="mb-2">
                                <strong>
                                    Fokusområde: Skalning & Justering
                                </strong>
                            </h3>
                            <ul className="ml-6 mb-6 space-y-2">
                                <li>
                                    <strong>
                                        Utvärdera rankingar & trafik:
                                    </strong>{" "}
                                    <span
                                        contentEditable
                                        suppressContentEditableWarning={true}
                                        onBlur={(e) =>
                                            setObservations({
                                                ...observations,
                                                q4_utvärdera_rankingar_trafik:
                                                    e.currentTarget.textContent,
                                            })
                                        }
                                        className="ml-1"
                                    >
                                        {observations.q4_utvärdera_rankingar_trafik ||
                                            "Ingen data"}
                                    </span>
                                </li>
                                <li>
                                    <strong>Skapa avancerat innehåll:</strong>{" "}
                                    <span
                                        contentEditable
                                        suppressContentEditableWarning={true}
                                        onBlur={(e) =>
                                            setObservations({
                                                ...observations,
                                                q4_skapa_avancerat_innehåll:
                                                    e.currentTarget.textContent,
                                            })
                                        }
                                        className="ml-1"
                                    >
                                        {observations.q4_skapa_avancerat_innehåll ||
                                            "Ingen data"}
                                    </span>
                                </li>
                                <li>
                                    <strong>Bygga starkare länkar:</strong>{" "}
                                    <span
                                        contentEditable
                                        suppressContentEditableWarning={true}
                                        onBlur={(e) =>
                                            setObservations({
                                                ...observations,
                                                q4_bygga_starkare_länkar:
                                                    e.currentTarget.textContent,
                                            })
                                        }
                                        className="ml-1"
                                    >
                                        {observations.q4_bygga_starkare_länkar ||
                                            "Ingen data"}
                                    </span>
                                </li>
                                <li>
                                    <strong>
                                        Eventuellt utbildning för kund:
                                    </strong>{" "}
                                    <span
                                        contentEditable
                                        suppressContentEditableWarning={true}
                                        onBlur={(e) =>
                                            setObservations({
                                                ...observations,
                                                q4_utbildning_kund:
                                                    e.currentTarget.textContent,
                                            })
                                        }
                                        className="ml-1"
                                    >
                                        {observations.q4_utbildning_kund ||
                                            "Ingen data"}
                                    </span>
                                </li>
                                <li>
                                    <strong>Offpage:</strong>{" "}
                                    <span
                                        contentEditable
                                        suppressContentEditableWarning={true}
                                        onBlur={(e) =>
                                            setObservations({
                                                ...observations,
                                                q4_offpage:
                                                    e.currentTarget.textContent,
                                            })
                                        }
                                        className="ml-1"
                                    >
                                        {observations.q4_offpage ||
                                            "Ingen data"}
                                    </span>
                                </li>
                            </ul>

                            <h3 className="mb-2">
                                <strong>
                                    Fokusområde: Utvärdering & Nästa steg
                                </strong>
                            </h3>
                            <ul className="ml-6 mb-6 space-y-2">
                                <li>
                                    <strong>
                                        Årsrapport med resultat mot KPI:er:
                                    </strong>{" "}
                                    <span
                                        contentEditable
                                        suppressContentEditableWarning={true}
                                        onBlur={(e) =>
                                            setObservations({
                                                ...observations,
                                                q4_arsrapport:
                                                    e.currentTarget.textContent,
                                            })
                                        }
                                        className="ml-1"
                                    >
                                        {observations.q4_arsrapport ||
                                            "Ingen data"}
                                    </span>
                                </li>
                                <li>
                                    <strong>ROI-analys:</strong>{" "}
                                    <span
                                        contentEditable
                                        suppressContentEditableWarning={true}
                                        onBlur={(e) =>
                                            setObservations({
                                                ...observations,
                                                q4_roi_analys:
                                                    e.currentTarget.textContent,
                                            })
                                        }
                                        className="ml-1"
                                    >
                                        {observations.q4_roi_analys ||
                                            "Ingen data"}
                                    </span>
                                </li>
                                <li>
                                    <strong>
                                        Strategimöte och plan för nästa år:
                                    </strong>{" "}
                                    <span
                                        contentEditable
                                        suppressContentEditableWarning={true}
                                        onBlur={(e) =>
                                            setObservations({
                                                ...observations,
                                                q4_strategimöte_plan:
                                                    e.currentTarget.textContent,
                                            })
                                        }
                                        className="ml-1"
                                    >
                                        {observations.q4_strategimöte_plan ||
                                            "Ingen data"}
                                    </span>
                                </li>
                            </ul>

                            {/* Avslutning */}
                            <h2 className="text-xl font-semibold mt-6">
                                Rapportering och nästa steg
                            </h2>

                            <p
                                contentEditable
                                suppressContentEditableWarning={true}
                                onBlur={(e) =>
                                    setObservations({
                                        ...observations,
                                        ready: e.currentTarget.textContent,
                                    })
                                }
                            >
                                {observations.ready || "Ingen data"}
                            </p>

                            <p>Med vänliga hälsningar,</p>
                            <p>Våning 18</p>
                            <p>epost@dinsida.se</p>
                            <p>070-123 45 67</p>
                        </div>

                        <button
                            onClick={handleDownloadPDF}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg text-center hover:bg-red-600 transition"
                        >
                            Download PDF
                        </button>
                        <button
                            onClick={() =>
                                createPPT({ formData, observations, favicon })
                            }
                            className="bg-blue-600 text-white px-4 py-2 rounded"
                        >
                            Download PowerPoint
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

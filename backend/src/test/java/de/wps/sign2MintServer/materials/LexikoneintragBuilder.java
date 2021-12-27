package de.wps.sign2MintServer.materials;

import java.util.List;

public final class LexikoneintragBuilder {
    private String definition;
    private boolean empfehlung;
    private String bedeutungsnummern;
    private String wortlink;
    private String wikipedialink;
    private String otherlink;
    private int variants;
    private String id;
    private String fachbegriff;
    private String videoLink;
    private List<String> fachgebiete;
    private List<String> ursprung;
    private List<String> verwendungskontext;
    private Gebaerdenschrift gebaerdenschrift;

    private LexikoneintragBuilder() {
    }

    public static LexikoneintragBuilder aLexikoneintrag() {
        return new LexikoneintragBuilder();
    }

    public LexikoneintragBuilder definition(String definition) {
        this.definition = definition;
        return this;
    }

    public LexikoneintragBuilder empfehlung(boolean empfehlung) {
        this.empfehlung = empfehlung;
        return this;
    }

    public LexikoneintragBuilder bedeutungsnummern(String bedeutungsnummern) {
        this.bedeutungsnummern = bedeutungsnummern;
        return this;
    }

    public LexikoneintragBuilder wortlink(String wortlink) {
        this.wortlink = wortlink;
        return this;
    }

    public LexikoneintragBuilder wikipedialink(String wikipedialink) {
        this.wikipedialink = wikipedialink;
        return this;
    }

    public LexikoneintragBuilder otherlink(String otherlink) {
        this.otherlink = otherlink;
        return this;
    }

    public LexikoneintragBuilder variants(int variants) {
        this.variants = variants;
        return this;
    }

    public LexikoneintragBuilder id(String id) {
        this.id = id;
        return this;
    }

    public LexikoneintragBuilder fachbegriff(String fachbegriff) {
        this.fachbegriff = fachbegriff;
        return this;
    }

    public LexikoneintragBuilder videoLink(String videoLink) {
        this.videoLink = videoLink;
        return this;
    }

    public LexikoneintragBuilder fachgebiete(List<String> fachgebiete) {
        this.fachgebiete = fachgebiete;
        return this;
    }

    public LexikoneintragBuilder ursprung(List<String> ursprung) {
        this.ursprung = ursprung;
        return this;
    }

    public LexikoneintragBuilder verwendungskontext(List<String> verwendungskontext) {
        this.verwendungskontext = verwendungskontext;
        return this;
    }

    public LexikoneintragBuilder gebaerdenschrift(Gebaerdenschrift gebaerdenschrift) {
        this.gebaerdenschrift = gebaerdenschrift;
        return this;
    }

    public Lexikoneintrag build() {
        Lexikoneintrag lexikoneintrag = new Lexikoneintrag(id, fachbegriff, videoLink, fachgebiete, ursprung, verwendungskontext, gebaerdenschrift);
        lexikoneintrag.setDefinition(definition);
        lexikoneintrag.setEmpfehlung(empfehlung);
        lexikoneintrag.setBedeutungsnummern(bedeutungsnummern);
        lexikoneintrag.setWortlink(wortlink);
        lexikoneintrag.setWikipedialink(wikipedialink);
        lexikoneintrag.setOtherlink(otherlink);
        lexikoneintrag.setVariants(variants);
        return lexikoneintrag;
    }
}

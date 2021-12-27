package de.wps.sign2MintServer.materials;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;

import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class LexikoneintragTest {

	private String id;
    private String fachbegriff;
    private String videoLink;
    private List<String> fachgebiet;
    private List<String> ursprung;
    private List<String> verwendungskontext;
    private Gebaerdenschrift gebaerdenschrift;

	@BeforeEach
	public void setUp() {
		id = "1";
		fachbegriff = "Softwaretest";
		videoLink = "";
		fachgebiet = new ArrayList<>();
		fachgebiet.add("Informatik");
		ursprung = new ArrayList<>();
		ursprung.add("bekannt");
		verwendungskontext = new ArrayList<>();
		verwendungskontext.add("Uni");
		gebaerdenschrift = null;
	}

	@Test
	public void testLexikoneintragConstructor() {
		Lexikoneintrag eintrag1 = new Lexikoneintrag(id, fachbegriff, videoLink, fachgebiet, ursprung, verwendungskontext, gebaerdenschrift);
		Lexikoneintrag eintrag2 = new Lexikoneintrag("2", "DevOps", "", new ArrayList<>(), new ArrayList<>(), new ArrayList<>(), gebaerdenschrift);

		assertNotEquals(eintrag2, eintrag1);
	}

	@Test
	public void testCalculateDistance() {
		// Arrange
		String searchword = "Tor";
		String checkword = "Tier";
		String searchword_2  = "Atomkraft";
		String checkword_3 = "Matodor";

		// Act
		int distance =  Lexikoneintrag.calculateDistance(searchword, checkword);
		int distance_1 = Lexikoneintrag.calculateDistance(searchword_2, checkword);
		int distance_2 = Lexikoneintrag.calculateDistance(searchword, checkword_3);
		int distance_3 = Lexikoneintrag.calculateDistance(checkword, searchword);
		int distance_4 = Lexikoneintrag.calculateDistance(searchword, searchword);

		// Assert
		assertEquals(2, distance);
		assertEquals(8, distance_1);
		assertEquals(5, distance_2);
		assertEquals(2, distance_3);
		assertEquals(0, distance_4);
		assertEquals(distance, distance_3);

	}

}

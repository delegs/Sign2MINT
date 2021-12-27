package de.wps.sign2MintServer.services;

import de.wps.sign2MintServer.materials.Gebaerdenschrift;
import de.wps.sign2MintServer.materials.Lexikoneintrag;
import de.wps.sign2MintServer.materials.LexikoneintragBuilder;
import de.wps.sign2MintServer.materials.SymbolId;
import de.wps.sign2MintServer.repositories.LexikoneintragRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ThreadLocalRandom;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class LexikoneintragServiceTest {

	private LexikoneintragService lexikoneintragService;

	@Mock
	private DefinitionService definitionServiceMock;
	@Mock
	private LexikoneintragRepository lexikoneintragRepositoryMock;

	private List<Lexikoneintrag> lexikoneintraege;

	@BeforeEach
	void setup() {
		lexikoneintragService = new LexikoneintragService(definitionServiceMock, lexikoneintragRepositoryMock);

		lexikoneintraege = new ArrayList<>();
		List<SymbolId> symbolIds;
		SymbolId symbolId;


		for(int i = 0; i < 1000; i++) {

			symbolIds = createSymbolIds(15);

			var lexikoneintrag = LexikoneintragBuilder.aLexikoneintrag()
					.gebaerdenschrift(new Gebaerdenschrift("", symbolIds))
					.id(Integer.toString(i))
					.build();

			lexikoneintraege.add(lexikoneintrag);
		}
	}

	@Test
	void getLexikoneintraege_all() {

		// Arrange
		final var lexikoneintrag = LexikoneintragBuilder.aLexikoneintrag().build();
		when(lexikoneintragRepositoryMock.findAll()).thenReturn(List.of(lexikoneintrag));

		// Act
		final var lexikonEintragList = lexikoneintragService.getLexikoneintraege(Optional.empty());

		// Assert
		assertFalse(lexikonEintragList.isEmpty());
	}

	@Test
	void getLexikoneintraege_all_ByMathematik() {

		// Arrange
		String fachgebiet0 = "Mathematik";
		List<String> fachgebiete = List.of(fachgebiet0);
		final var eintrag = LexikoneintragBuilder.aLexikoneintrag().fachgebiete(fachgebiete).build();
		when(lexikoneintragRepositoryMock.findAll()).thenReturn(List.of(eintrag));

		// Act
		List<Lexikoneintrag> lexikonEintragList = lexikoneintragService.getLexikoneintraege(Optional.of(fachgebiete));

		// Assert
		boolean result = lexikonEintragList.stream().allMatch(le -> le.getFachgebiete().contains(fachgebiet0));
		assertTrue(result);
	}

	@Test
	void getLexikoneintraege_all_ByMathematikAndPhysik() {

		// Arrange
		String fachgebiet0 = "Mathematik";
		String fachgebiet1 = "Physik";
		final var fachgebiete = List.of(fachgebiet0, fachgebiet1);
		final var eintrag1 = LexikoneintragBuilder.aLexikoneintrag().fachgebiete(fachgebiete).build();
		final var eintrag2 = LexikoneintragBuilder.aLexikoneintrag().fachgebiete(List.of(fachgebiet0)).build();
		final var eintrag3 = LexikoneintragBuilder.aLexikoneintrag().fachgebiete(List.of(fachgebiet1)).build();
		final var eintrag4 = LexikoneintragBuilder.aLexikoneintrag().fachgebiete(List.of("Wambo")).build();
		when(lexikoneintragRepositoryMock.findAll()).thenReturn(List.of(eintrag1, eintrag2, eintrag3, eintrag4));

		// Act
		List<Lexikoneintrag> lexikonEintragList = lexikoneintragService.getLexikoneintraege(Optional.of(fachgebiete));

		// Assert
		boolean result = lexikonEintragList.stream().allMatch(le -> (le.getFachgebiete().contains(fachgebiet0)
				|| le.getFachgebiete().contains(fachgebiet1)));
		assertTrue(result);
	}

	@Test
	void getLexikoneintraege_all_ByCount() {

		// Arrange
		String fachgebiet0 = "Mathematik";
		String fachgebiet1 = "Physik";
		final var fachgebiete0And1 = List.of(fachgebiet0, fachgebiet1);
		final var eintrag1 = LexikoneintragBuilder.aLexikoneintrag().fachgebiete(fachgebiete0And1).build();
		final var fachgebiete0 = List.of(fachgebiet0);
		final var fachgebiete1 = List.of(fachgebiet1);
		final var eintrag2 = LexikoneintragBuilder.aLexikoneintrag().fachgebiete(fachgebiete0).build();
		final var eintrag3 = LexikoneintragBuilder.aLexikoneintrag().fachgebiete(List.of(fachgebiet1)).build();
		final var eintrag4 = LexikoneintragBuilder.aLexikoneintrag().fachgebiete(List.of("Wambo")).build();
		when(lexikoneintragRepositoryMock.findAll()).thenReturn(List.of(eintrag1, eintrag2, eintrag3, eintrag4));

		// Act
		int countAll = lexikoneintragService.getLexikoneintraege(Optional.empty()).size();
		int count0 = lexikoneintragService.getLexikoneintraege(Optional.of(fachgebiete0)).size();
		int count1 = lexikoneintragService.getLexikoneintraege(Optional.of(fachgebiete1)).size();
		int count0And1 = lexikoneintragService.getLexikoneintraege(Optional.of(fachgebiete0And1)).size();

		// Assert
		assertTrue((countAll >= count0) && (countAll >= count1) && countAll >= count0 + count1 && count0 <= count0And1
				&& count1 <= count0And1);
	}

	@Test
	void getLexikoneintraege_all_ByFachbegriffAndFachgebiet() {

		// Arrange
		String fachbegriff = "Atom";
		List<String> fachgebiete = Arrays.asList("Physik", "Chemie");
		String fachgebiet0 = fachgebiete.get(0);
		final var lexikoneintrag = LexikoneintragBuilder.aLexikoneintrag()
				.fachbegriff(fachbegriff)
				.fachgebiete(fachgebiete)
				.wortlink("")
				.bedeutungsnummern("")
				.build();
		when(lexikoneintragRepositoryMock.findAll()).thenReturn(List.of(lexikoneintrag));

		// Act
		List<Lexikoneintrag> lexikonEintragList = lexikoneintragService
				.getLexikoneintragByFachbegriffANDFachgebiete(fachbegriff, Optional.of(fachgebiete));
		boolean result = lexikonEintragList.stream().allMatch(le -> (le.getFachgebiete().contains(fachgebiet0)
				&& le.getFachbegriff().contains(fachbegriff)
				&& le.getFachgebiete().contains("Chemie")
				&& !le.getFachgebiete().contains("Mathematik")));

		// Assert
		assertTrue(result);
	}

	@Test
	void getLexikoneintraege_all_ByFachbegriffAndUnknowFachgebiet() {

		// Arrange
		String fachbegriff = "Atom";
		List<String> fachgebiete = List.of("XYZ");
		final var lexikoneintrag = LexikoneintragBuilder.aLexikoneintrag()
				.fachbegriff(fachbegriff)
				.fachgebiete(List.of("Mathematik"))
				.wortlink("")
				.bedeutungsnummern("42")
				.build();
		when(lexikoneintragRepositoryMock.findAll()).thenReturn(List.of(lexikoneintrag));

		// Act
		List<Lexikoneintrag> lexikonEintragList = lexikoneintragService
				.getLexikoneintragByFachbegriffANDFachgebiete(fachbegriff, Optional.of(fachgebiete));

		// Assert
		assertNull(lexikonEintragList);
	}

	@Test
	void getLexikoneintraege_all_ByUnknowFachbegriffAndFachgebiet() {

		// Arrange
		String fachbegriff = "XYZ";
		List<String> fachgebiete = List.of("Chemie");
		final var lexikoneintrag = LexikoneintragBuilder.aLexikoneintrag()
				.fachbegriff("Nicht XYZ")
				.fachgebiete(fachgebiete)
				.wortlink("")
				.bedeutungsnummern("42")
				.build();
		when(lexikoneintragRepositoryMock.findAll()).thenReturn(List.of(lexikoneintrag));

		// Act
		List<Lexikoneintrag> lexikonEintragList = lexikoneintragService
				.getLexikoneintragByFachbegriffANDFachgebiete(fachbegriff, Optional.of(fachgebiete));

		// Assert
		assertNull(lexikonEintragList);
	}

	@Test
	void getLexikoneintraege_all_ByCharAndFachgebiet() {

		// Arrange
		String fachbegriff = "At";
		List<String> fachgebiete = List.of("Mathematik");
		String fachgebiet0 = fachgebiete.get(0);
		final var lexikoneintrag = LexikoneintragBuilder.aLexikoneintrag()
				.fachbegriff(fachbegriff)
				.fachgebiete(List.of("Mathematik"))
				.wortlink("")
				.bedeutungsnummern("42")
				.build();
		when(lexikoneintragRepositoryMock.findAll()).thenReturn(List.of(lexikoneintrag));

		// Act
		List<Lexikoneintrag> lexikonEintragList = lexikoneintragService.getLexikoneintraegeForChar(fachbegriff,
				Optional.of(fachgebiete));

		// Assert
		boolean result = lexikonEintragList.stream().allMatch(le -> (le.getFachgebiete().contains(fachgebiet0)
				|| le.getFachbegriff().contains(fachbegriff)));
		assertTrue(result);
	}

	@Test
	void testUniqueLexikoneintraegeliste() {

		// Arrange
		List<Lexikoneintrag> testListe = new ArrayList<>();
		testListe.add(erstelleMatheLexikoneintrag("Addition"));
		testListe.add(erstelleMatheLexikoneintrag("Addition"));
		testListe.add(erstelleMatheLexikoneintrag("Alpha"));
		testListe.add(erstelleMatheLexikoneintrag("Alpha"));
		testListe.add(erstelleMatheLexikoneintrag("Alpha"));
		testListe.add(erstelleMatheLexikoneintrag("Alpha"));
		testListe.add(erstelleMatheLexikoneintrag("Alpaca"));
		testListe.add(erstelleMatheLexikoneintrag("addieren"));
		testListe.add(erstelleMatheLexikoneintrag("Beta"));
		testListe.add(erstelleMatheLexikoneintrag("Beta"));
		when(lexikoneintragRepositoryMock.findAll()).thenReturn(testListe);

		// Act
		List<Lexikoneintrag> result = lexikoneintragService.getLexikoneintraegeForChar("a",
				Optional.of(List.of("Mathematik")));

		// Assert
		assertEquals(4, result.size());
		assertEquals("addieren", result.get(0).getFachbegriff());
		assertEquals("Addition", result.get(1).getFachbegriff());
		assertEquals("Alpaca", result.get(2).getFachbegriff());
		assertEquals("Alpha", result.get(3).getFachbegriff());
	}

	@Test
	public void testGetLexikoneintraegeBySearchTerm() {

		// Arrange
		List<Lexikoneintrag> atomEntries = new ArrayList<>();
		atomEntries.add(erstelleMatheLexikoneintrag("Atom"));
		atomEntries.add(erstelleMatheLexikoneintrag("Atomarer Waffenhandel"));
		atomEntries.add(erstelleMatheLexikoneintrag("Atomexplosion"));
		atomEntries.add(erstelleMatheLexikoneintrag("Atomisierung"));
		atomEntries.add(erstelleMatheLexikoneintrag("Atomisierung"));
		atomEntries.add(erstelleMatheLexikoneintrag("Atomares Waffenarsenal"));
		atomEntries.add(erstelleMatheLexikoneintrag("Batomares Waffenarsenal"));
		atomEntries.add(erstelleMatheLexikoneintrag("Eines Tages"));
		atomEntries.add(erstelleMatheLexikoneintrag("Ging ein Hund"));
		atomEntries.add(erstelleMatheLexikoneintrag("In die Schule"));
		atomEntries.add(erstelleMatheLexikoneintrag("Und die Kinder freuten sich"));

		when(lexikoneintragRepositoryMock.findAll()).thenReturn(atomEntries);

		// Act
		List<Lexikoneintrag> result = lexikoneintragService.getLexikoneintraegeBySearchTerm("at");

		// Assert
		assertEquals(5, result.size());
		assertEquals("Atom", result.get(0).getFachbegriff());
		assertEquals("Atomarer Waffenhandel", result.get(1).getFachbegriff());
		assertEquals("Atomares Waffenarsenal", result.get(2).getFachbegriff());
		assertEquals("Atomexplosion", result.get(3).getFachbegriff());
		assertEquals("Atomisierung", result.get(4).getFachbegriff());
	}

	@Test
	public void testGetLexikoneintraegeBySearchTermLenghtBiggerThan_3() {

		// Arrange
		List<Lexikoneintrag> atomEntries = new ArrayList<>();
		atomEntries.add(erstelleMatheLexikoneintrag("Atom"));
		atomEntries.add(erstelleMatheLexikoneintrag("Atomarer Waffenhandel"));
		atomEntries.add(erstelleMatheLexikoneintrag("Atomexplosion"));
		atomEntries.add(erstelleMatheLexikoneintrag("Atomisierung"));
		atomEntries.add(erstelleMatheLexikoneintrag("Atomisierung"));
		atomEntries.add(erstelleMatheLexikoneintrag("Atomares Waffenarsenal"));
		atomEntries.add(erstelleMatheLexikoneintrag("Batomares Waffenarsenal"));
		atomEntries.add(erstelleMatheLexikoneintrag("Eines Tages"));
		atomEntries.add(erstelleMatheLexikoneintrag("Ging ein Hund"));
		atomEntries.add(erstelleMatheLexikoneintrag("In die Schule"));
		atomEntries.add(erstelleMatheLexikoneintrag("Und die Kinder freuten sich"));

		when(lexikoneintragRepositoryMock.findAll()).thenReturn(atomEntries);

		// Act
		List<Lexikoneintrag> result = lexikoneintragService.getLexikoneintraegeBySearchTerm("atom");

		// Assert
		assertEquals(6, result.size());
		assertEquals("Atom", result.get(0).getFachbegriff());
		assertEquals("Atomisierung", result.get(1).getFachbegriff());
		assertEquals("Atomexplosion", result.get(2).getFachbegriff());
		assertEquals("Atomarer Waffenhandel", result.get(3).getFachbegriff());
		assertEquals("Atomares Waffenarsenal", result.get(4).getFachbegriff());
	}

	@Test
	public void testSortByDistance() {

		// Arrange
		List<Lexikoneintrag> searchwordList = new ArrayList<>();
		Lexikoneintrag eintrag = new Lexikoneintrag("0", "Atom", "", new ArrayList<>(), new ArrayList<>(), new ArrayList<>(), null);
		searchwordList.add(eintrag);
		eintrag = new Lexikoneintrag("1", "Atommasse", "", new ArrayList<>(), new ArrayList<>(), new ArrayList<>(), null);
		searchwordList.add(eintrag);
		eintrag = new Lexikoneintrag("2", "AtomKraft", "", new ArrayList<>(), new ArrayList<>(), new ArrayList<>(), null);
		searchwordList.add(eintrag);
		eintrag = new Lexikoneintrag("3", "Atommarisiert", "", new ArrayList<>(), new ArrayList<>(), new ArrayList<>(), null);
		searchwordList.add(eintrag);
		eintrag = new Lexikoneintrag("4", "Ballator", "", new ArrayList<>(), new ArrayList<>(), new ArrayList<>(),null);
		searchwordList.add(eintrag);
		eintrag = new Lexikoneintrag("5", "Transformator", "", new ArrayList<>(), new ArrayList<>(), new ArrayList<>(), null);
		searchwordList.add(eintrag);
		eintrag = new Lexikoneintrag("6", "Matador", "", new ArrayList<>(), new ArrayList<>(), new ArrayList<>(), null);
		searchwordList.add(eintrag);

		String searchword = "ato";

		// Act
		lexikoneintragService.sortByDistance(searchword, searchwordList);

		// Assert
		assertEquals("Atom", searchwordList.get(0).getFachbegriff());
		assertEquals("Matador", searchwordList.get(1).getFachbegriff());
		assertEquals("Ballator", searchwordList.get(2).getFachbegriff());
		assertEquals("Atommasse", searchwordList.get(3).getFachbegriff());
		assertEquals("AtomKraft", searchwordList.get(4).getFachbegriff());
		assertEquals("Atommarisiert", searchwordList.get(5).getFachbegriff());
		assertEquals("Transformator", searchwordList.get(6).getFachbegriff());
	}

	@Test
	public void findLexikoneintraege_WhichContainsAllSymbolIdsOrAllophoneOfSelectedHandformen_ContainsFourLexikoneintraege() {

		// Arrange
		var requestedSymbolIds = new ArrayList<SymbolId>();

		var selectedHandform_1 = new SymbolId("02-01-001-01-XX-XX");
		var selectedHandform_2 = new SymbolId("03-01-001-01-XX-XX");

		var allophone_1_1 = new SymbolId("02-01-010-01-XX-XX");
		var allophone_1_2 = new SymbolId("03-01-010-01-XX-XX");

		var allophone_2_1 = new SymbolId("03-01-018-01-XX-XX");

		var allophoneForSelectedHandform_1 = selectedHandform_1.getAllophone();
		allophoneForSelectedHandform_1.add(allophone_1_1);
		allophoneForSelectedHandform_1.add(allophone_1_2);

		var allophoneForSelectedHandform_2 = selectedHandform_2.getAllophone();
		allophoneForSelectedHandform_2.add(allophone_2_1);

		requestedSymbolIds.add(selectedHandform_1);
		requestedSymbolIds.add(selectedHandform_2);

		// 20: enthält Handform 1 und 2
		lexikoneintraege.get(20).getGebaerdenschrift().getSymbolIds().add(selectedHandform_1);
		lexikoneintraege.get(20).getGebaerdenschrift().getSymbolIds().add(selectedHandform_2);

		// 40: enthält Handform 2 und Allophon 1_2
		lexikoneintraege.get(40).getGebaerdenschrift().getSymbolIds().add(selectedHandform_2);
		lexikoneintraege.get(40).getGebaerdenschrift().getSymbolIds().add(allophone_1_2);

		// 5: enthält Handform 1 und Allophon 2_1
		lexikoneintraege.get(5).getGebaerdenschrift().getSymbolIds().add(selectedHandform_1);
		lexikoneintraege.get(5).getGebaerdenschrift().getSymbolIds().add(allophone_2_1);

		// 17: enthält Allophon 1_1 und Allophon 2_1
		lexikoneintraege.get(17).getGebaerdenschrift().getSymbolIds().add(allophone_1_1);
		lexikoneintraege.get(17).getGebaerdenschrift().getSymbolIds().add(allophone_2_1);

		when(lexikoneintragRepositoryMock.findAll()).thenReturn(lexikoneintraege);

		// Act
		List<Lexikoneintrag> result = lexikoneintragService.findLexikoneintraegeForAllSymbolIds(requestedSymbolIds);

		// Assert
		assertEquals(4, result.size());
	}

	@Test
	public void findLexikoneintraege_ForSelectedHandform_ContainsZeroLexikoneintraege() {

		// Arrange
		var requestedSymbolIds = new ArrayList<SymbolId>();

		var selectedHandform = new SymbolId("02-01-001-01-XX-XX");

		requestedSymbolIds.add(selectedHandform);

		when(lexikoneintragRepositoryMock.findAll()).thenReturn(lexikoneintraege);

		// Act
		List<Lexikoneintrag> result = lexikoneintragService.findLexikoneintraegeForAllSymbolIds(requestedSymbolIds);

		// Assert
		assertEquals(0, result.size());
	}

	@Test
	public void findLexikoneintraege_WithEmptySymbolIds_Contains1000Lexikoneintraege() {

		// Arrange
		var requestedSymbolIds = new ArrayList<SymbolId>();

		when(lexikoneintragRepositoryMock.findAll()).thenReturn(lexikoneintraege);

		// Act
		List<Lexikoneintrag> result = lexikoneintragService.findLexikoneintraegeForAllSymbolIds(requestedSymbolIds);

		// Assert
		assertEquals(1000, result.size());
	}

	private Lexikoneintrag erstelleMatheLexikoneintrag(String fachbegriff) {

		return LexikoneintragBuilder.aLexikoneintrag().fachbegriff(fachbegriff).fachgebiete((List.of("Mathematik")))
				.build();
	}

	private List<SymbolId> createSymbolIds(int number) {
		int max = 9;
		int min = 1;
		final var baseSymbolId = "01-01-001-01-01-0";
		return ThreadLocalRandom.current()
				.ints(number, min, max + 1)
				.mapToObj(randomValue -> baseSymbolId + randomValue)
				.map(SymbolId::new)
				.collect(Collectors.toList());
	}
}

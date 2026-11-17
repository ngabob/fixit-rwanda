// Keep service IDs stable because profiles and job requests store them.
export const serviceGroups = [
  ['Home repairs & utilities', 'Gusana urugo n’imiyoboro', [
    ['plumbing', 'Plumbing', 'Gusana imiyoboro y’amazi'],
    ['electrical', 'Electrical', 'Amashanyarazi'],
    ['handyman', 'General home repairs', 'Gusana ibintu bitandukanye mu rugo'],
    ['locksmith', 'Locks & keys', 'Ingufuri n’imfunguzo'],
    ['leak-detection', 'Water leak detection', 'Kumenya aho amazi ava'],
    ['drain-cleaning', 'Blocked drains', 'Kuzibura imiyoboro y’amazi'],
    ['water-heaters', 'Water heater service', 'Gusana ibyuma bishyushya amazi'],
    ['water-tank-install', 'Water tank installation', 'Gushyiraho ibigega by’amazi'],
    ['water-pumps', 'Water pump repair', 'Gusana amapompe y’amazi'],
    ['septic-service', 'Septic tank service', 'Gusukura no gusana ibyobo by’imyanda']
  ]],
  ['Cleaning & pest control', 'Isuku no kurwanya udukoko', [
    ['cleaning', 'House cleaning', 'Isuku yo mu rugo'],
    ['deep-cleaning', 'Deep cleaning', 'Isuku yimbitse'],
    ['move-out-cleaning', 'Move-in & move-out cleaning', 'Isuku mbere cyangwa nyuma yo kwimuka'],
    ['office-cleaning', 'Office cleaning', 'Gusukura ibiro'],
    ['carpet-cleaning', 'Carpet cleaning', 'Gusukura amatapi'],
    ['upholstery-cleaning', 'Sofa & upholstery cleaning', 'Gusukura amasofa n’intebe'],
    ['window-cleaning', 'Window cleaning', 'Gusukura ibirahure by’amadirishya'],
    ['water-tank-cleaning', 'Water tank cleaning', 'Gusukura ibigega by’amazi'],
    ['pest-control', 'Pest control', 'Kurwanya udukoko'],
    ['termite-control', 'Termite control', 'Kurwanya umuswa'],
    ['laundry', 'Laundry & ironing', 'Kumesa no gutera ipasi']
  ]],
  ['Painting & renovation', 'Amarangi no kuvugurura', [
    ['painting', 'Painting', 'Gusiga amarangi'],
    ['exterior-painting', 'Exterior painting', 'Gusiga amarangi hanze'],
    ['tiling', 'Tile installation', 'Gushyiraho amakaro'],
    ['flooring', 'Floor installation & repair', 'Gushyiraho no gusana hasi'],
    ['ceiling-work', 'Ceiling installation & repair', 'Gushyiraho no gusana plafoni'],
    ['plastering', 'Plastering', 'Guhoma inkuta'],
    ['waterproofing', 'Waterproofing', 'Kurinda inyubako kwinjirwamo n’amazi'],
    ['bathroom-renovation', 'Bathroom renovation', 'Kuvugurura ubwiherero'],
    ['kitchen-renovation', 'Kitchen renovation', 'Kuvugurura igikoni'],
    ['interior-design', 'Interior design', 'Gutunganya imiterere y’imbere mu nzu']
  ]],
  ['Carpentry, metal & glass', 'Ububaji, ibyuma n’ibirahure', [
    ['carpentry', 'Carpentry', 'Ububaji'],
    ['custom-furniture', 'Custom furniture', 'Gukora ibikoresho byo mu nzu byatumijwe'],
    ['furniture-repair', 'Furniture repair', 'Gusana ibikoresho byo mu nzu'],
    ['cabinet-installation', 'Cabinet installation', 'Gushyiraho utubati'],
    ['door-repair', 'Door installation & repair', 'Gushyiraho no gusana inzugi'],
    ['window-repair', 'Window installation & repair', 'Gushyiraho no gusana amadirishya'],
    ['welding', 'Welding & metalwork', 'Gusudira no gukora ibyuma'],
    ['glass-replacement', 'Glass replacement', 'Gusimbuza ibirahure'],
    ['gate-repair', 'Gate installation & repair', 'Gushyiraho no gusana amarembo']
  ]],
  ['Appliances, power & technology', 'Ibikoresho, ingufu n’ikoranabuhanga', [
    ['appliances', 'Appliance repair', 'Gusana ibikoresho byo mu rugo'],
    ['refrigerator-repair', 'Refrigerator repair', 'Gusana firigo'],
    ['washer-repair', 'Washing machine repair', 'Gusana imashini imesa'],
    ['oven-repair', 'Oven & cooker repair', 'Gusana amashyiga n’amafuru'],
    ['ac-service', 'Air conditioner service', 'Gushyiraho no gusana ibyuma bikonjesha'],
    ['solar-installation', 'Solar panel installation', 'Gushyiraho imirasire y’izuba'],
    ['inverter-service', 'Inverter & battery service', 'Gusana iniveriteri na batiri'],
    ['generator-repair', 'Generator repair', 'Gusana jenerateri'],
    ['cctv-installation', 'Security camera installation', 'Gushyiraho kamera z’umutekano'],
    ['wifi-setup', 'Wi-Fi setup', 'Gutunganya Wi-Fi'],
    ['computer-repair', 'Computer repair', 'Gusana mudasobwa'],
    ['tv-antenna', 'TV antenna & satellite setup', 'Gushyiraho antene na parabole bya televiziyo']
  ]],
  ['Outdoor & building work', 'Imirimo yo hanze n’ubwubatsi', [
    ['roofing', 'Roof installation & repair', 'Kubaka no gusana ibisenge'],
    ['gutter-work', 'Gutter cleaning & repair', 'Gusukura no gusana imiferege y’imvura'],
    ['masonry', 'Masonry', 'Kubakisha amatafari n’amabuye'],
    ['concrete-work', 'Concrete work', 'Imirimo ya beto'],
    ['paving', 'Paving & driveways', 'Gushyira pave mu mbuga no mu nzira'],
    ['fencing', 'Fence installation & repair', 'Kubaka no gusana uruzitiro'],
    ['landscaping', 'Landscaping', 'Gutunganya ubusitani'],
    ['gardening', 'Garden maintenance', 'Kubungabunga ubusitani'],
    ['tree-trimming', 'Tree trimming', 'Gukata amashami y’ibiti'],
    ['irrigation', 'Garden irrigation', 'Gushyiraho uburyo bwo kuhira ubusitani'],
    ['outdoor-drainage', 'Outdoor drainage', 'Gutunganya inzira z’amazi hanze']
  ]],
  ['Moving & installation', 'Kwimuka no gushyiraho ibikoresho', [
    ['moving', 'Home moving', 'Gufasha kwimura urugo'],
    ['office-moving', 'Office moving', 'Gufasha kwimura ibiro'],
    ['packing', 'Packing & unpacking', 'Gupakira no gupakurura ibintu'],
    ['waste-removal', 'Waste & debris removal', 'Kuvana imyanda n’ibisigazwa by’ubwubatsi'],
    ['furniture-assembly', 'Furniture assembly', 'Guteranya ibikoresho byo mu nzu'],
    ['tv-mounting', 'TV mounting', 'Kumanika televiziyo ku rukuta'],
    ['curtain-installation', 'Curtain & blind installation', 'Gushyiraho amarido n’ibitwikira amadirishya'],
    ['shelf-installation', 'Shelving installation', 'Gushyiraho amashelufu'],
    ['fixture-installation', 'Bathroom fixture installation', 'Gushyiraho ibikoresho byo mu bwogero']
  ]],
  ['Events & photos', 'Ibirori n’amafoto', [
    ['event-planning', 'Event planning', 'Gutegura ibirori'],
    ['event-decoration', 'Event decoration', 'Gushariza ahabera ibirori'],
    ['catering', 'Event catering', 'Gutegura amafunguro y’ibirori'],
    ['photography', 'Photography', 'Gufotora'],
    ['videography', 'Videography', 'Gufata amashusho'],
    ['dj-services', 'DJ services', 'Gucuranga umuziki mu birori'],
    ['sound-rental', 'Sound equipment rental', 'Gukodesha ibyuma by’amajwi'],
    ['tent-rental', 'Tent & chair rental', 'Gukodesha amahema n’intebe']
  ]]
];

export const serviceNames = new Map();
for (const [, , services] of serviceGroups) {
  for (const [id, en, rw] of services) serviceNames.set(id, { en, rw });
}

var rant = new RantEngine();
rant.LoadPackage("Rantionary");
var output = rant.Do(@"The <adj> <adj> <noun-animal> <verb.s-walk> over the <adj> <noun-animal>.");
Console.WriteLine(output);

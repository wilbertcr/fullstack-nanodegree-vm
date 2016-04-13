from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from sql_alchemy_setup import Base, User, Category, Item

engine = create_engine('postgresql://vagrant:vagrantvm@localhost:5432/catalog', echo=True)
# Bind the engine to the metadata of the Base class so that the
# declaratives can be accessed through a DBSession instance
Base.metadata.bind = engine

DBSession = sessionmaker(bind=engine)
# A DBSession() instance establishes all conversations with the database
# and represents a "staging zone" for all the objects loaded into the
# database session object. Any change made against the objects in the
# session won't be persisted into the database until you call
# session.commit(). If you're not happy about the changes, you can
# revert all of them back to the last commit by calling
# session.rollback()
session = DBSession()

# Create dummy user
user1 = User(name="Wilbert Sequeira",
             id='105535004167557516646',
             email="wilbertcr@gmail.com",
             picture='static/images/wilbert_profile.jpg',
             is_admin=True)
session.add(user1)
session.commit()

# Menu for UrbanBurger

category1 = Category(name="Baseball",
                     picture="/static/images/sports_icons/svg/baseball.svg")

item11 = Item(name="DeMarini CF7 BBCOR Baseball Bat DXCFC",
              description="Demarini CF7 (-3) College High School Baseball Bats Features: For players who refuse to "
                          "bow down to any limitation, the CF7 is the most powerful, lightest swinging DeMarini bat. "
                          "Features All New Paradox +Plus composite barrel for faster swing speeds and maximum pop. "
                          "The D-Fusion FT is flame tempered to have a stiffer feel, while eliminating vibration by "
                          "redirecting energy back into the barrel. PRODUCT SPECS: Certification: BBCOR Handle Type: "
                          "Composite Barrel Diameter: 2 5/8\" Barrel Material: Composite SIZES: 30\"/27 oz 31\"/28 oz "
                          "32\"/29 oz 33\"/30 oz 34\"/31 oz",
              picture="static/images/baseball_bat.jpg",
              category=category1,
              price="199.99")

item12 = Item(name="Wilson A2000 Pedroia DP15 Game Model Baseball Glove, 11.5\", Right Hand Throw",
              description="The Wilson A2000 series enters its 55th year of game changing performance, constructed "
                          "from world-famous Pro Stock leather, the secret to its unmatched life span. Our American "
                          "Steerhide is prized by professional players for its rugged durability and unmatched feel. "
                          "Double welting provides the most durable pocket out there, along with long-lasting break-in."
                          " Ultra-breathable Dri-Lex wrist lining transfers moisture from the skin, keeping your hand "
                          "cool and dry. Equipped with rolled welting and a low impact heel. Extra-long lacing. "
                          "Wilson's exclusive hand designed patterns are continuously improved year after year, "
                          "so you're guaranteed the highest quality on the market. This 11.5\" baseball model is "
                          "designed for infielders with an H-Web, open back and a 2x laced web base.",
              picture="static/images/baseball_glove.jpg",
              category=category1,
              price="249.95")

category2 = Category(name="Basketball",
                     picture="static/images/sports_icons/svg/basketball.svg")

item21 = Item(name="Spalding Street Basketball 29.5\", Orange",
              description="The Spalding NBA outdoor 29.5\" basketball is designed to withstand the street game with a "
                          "durable outdoor cover. It displays an NBA logo. Color: Multi. Gender: Unisex. Age Group: "
                          "Adult",
              picture="static/images/basketball_ball.jpg",
              category=category2,
              price="11.79")

item22 = Item(name="Spalding 88461G 60 inch Glass In-Ground Basketball System",
              description="The Spalding 88461G NBA 60\" in-ground basketball system is sturdy and durable thanks to "
                          "a steel-framed tempered glass backboard. Its U-Turn lift system allows you to move the "
                          "basket anywhere from 7.5' to 10', and a convenient 2' offset allows play under the rim.",
              picture="static/images/basketball_rim.jpg",
              category=category2,
              price="504.29")

category3 = Category(name="Climbing",
                     picture="static/images/sports_icons/svg/climbing.svg")

item31 = Item(name="Mad Rock Venus Deluxe Climbing Package - Women's One Color, S",
              description="Mad Rock designed the Women's Venus Deluxe Climbing Package for female rock monkeys "
                          "looking to get the essentials for gym climbing or cragging in a convenient package deal. "
                          "Mad Rock included the versatile Venus harness, which features a women-specific design and "
                          "three adjustable buckles for a wide fit range. The Venus' four plastic gear loops hold all "
                          "your quickdraws and cams, and the Koala Chalk Bag helps keep your hands grippin' until you "
                          "clip the chains.",
              picture="static/images/climbing_gear.jpg",
              category=category3,
              price="69.95")

item32 = Item(name="Mammut El Cap Climbing Helmet Orange-graphite, 56-61cm",
              description="Named for the looming vertical master, the Mammut El Cap Climbing Helmet boasts a "
                          "tech-savvy design that its namesake would deem worthy. Protect your head and focus "
                          "on your vertical progress.",
              picture="static/images/climbing_helmet.jpg",
              category=category3,
              price="55.96")

category4 = Category(name="Foosball",
                     picture="static/images/sports_icons/svg/foosball.svg")

item41 = Item(name="Tornado Elite Foosball Table",
              description="For a high-quality game table that not only plays well but looks nice, try the "
                          "Tornado Elite Foosball Table! The new and improved foosball men are counterbalanced and "
                          "feature a re-designed ''foot'' for more precise ball control. You can easily control them "
                          "thanks to the durable hollow steel rods and thick, natural wood handles. Dual side ball "
                          "returns make game play easy while sliding scoring units allow you to keep track of who is "
                          "on top! The Tornado Elite Foosball Table is a sure fire way to add a touch of class and "
                          "enjoyment to any home game room!",
              picture="static/images/foosball_table.jpg",
              category=category4,
              price="1,850.00")

item42 = Item(name="Warrior Table Soccer Foosball",
              description="Great for any table. - Provides superior gripping. - Excellent control. - Consistent play. "
                          "- Overall Height - Top to Bottom: 1.375\". Overall Width - Side to Side: 1.375\". Overall "
                          "Depth - Front to Back: 1.375\". Overall Product Weight: 0.62 lbs. - Cabinet Material: "
                          "Plastic. - Number of Items Included: 10 Color: Red.",
              picture="static/images/foosball_ball.jpg",
              category=category4,
              price="24.99")

categories = [category1, category2, category3, category4]
session.add_all(categories)
session.commit()

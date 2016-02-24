from BaseHTTPServer import BaseHTTPRequestHandler, HTTPServer
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from database_setup import Base, Restaurant, MenuItem

import webbrowser, cgi, re

engine = create_engine('postgresql://vagrant:vagrantvm@localhost:5432/restaurant')
Base.metadata.bind = engine
DBSession = sessionmaker(bind=engine)
session = DBSession()

restaurant_edit_regex = re.compile("(/restaurants/)?(\d+)?(/edit)")
restaurant_delete_regex = re.compile("(/restaurants/)?(\d+)?(/delete)")

class webserverHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        try:
            if self.path.endswith("/restaurants"):
                self.send_response(200)
                self.send_header('Content-type','text/html')
                self.end_headers()
                output = ""
                output += "<html><body><p>Restaurants:</p>"
                restaurants = session.query(Restaurant).all()
                output += "<ul>"
                for restaurant in restaurants:
                    output += "<li>Name: {0}<br>" \
                              "<a href='/restaurants/{1}/edit'>Edit</a><br>" \
                              "<a href='/restaurants/{1}/delete'>Delete</a><br>" \
                              "</li>".format(restaurant.name,restaurant.id)
                output += "</ul>"
                output += "<a href='/restaurants/new'>Make a New Restaurant Here</a>"
                output += "</body></html>"
                self.wfile.write(output)
                print(output)
                return
            if self.path.endswith("/restaurants/new"):
                self.send_response(200)
                self.send_header('Content-type','text/html')
                self.end_headers()
                output = ""
                output += "<html><body>"
                output += '''<form method='POST' enctype='multipart/form-data' action='/restaurants/new'><h2>Add a restaurant?</h2><input name="message" type="text" ><input type="submit" value="Submit"> </form>'''
                output += "<a href='/restaurants'>Show restaurants list</a>"
                output += "</body></html>"
                self.wfile.write(output)
                print(output)
                return
            if restaurant_edit_regex.search(self.path):
                restaurant_id = restaurant_edit_regex.search(self.path).group(2)
                restaurant = session.query(Restaurant).filter_by(id=restaurant_id).one()
                self.send_response(200)
                self.send_header('Content-type','text/html')
                self.end_headers()
                output = ""
                output += "<html><body>"
                output += '''<form method='POST' enctype='multipart/form-data' action='/restaurants/edit'>'''
                output += '''<h2>Edit restaurant's name:</h2>'''
                output += '''<input name="id" type="hidden" value="{0}">'''.format(restaurant.id)
                output += '''<input name="message" type="text" value="'''+restaurant.name
                output += '''">
                <input type="submit" value="Submit">
                </form>'''
                output += "<a href='/restaurants'>Show restaurants list</a>"
                output += "</body></html>"
                self.wfile.write(output)
                print(output)
                return
            if restaurant_delete_regex.search(self.path):
                restaurant_id = restaurant_delete_regex.search(self.path).group(2)
                restaurant = session.query(Restaurant).filter_by(id=restaurant_id).one()
                self.send_response(200)
                self.send_header('Content-type','text/html')
                self.end_headers()
                output = ""
                output += "<html><body>"
                output += '''<form method='POST' enctype='multipart/form-data' action='/restaurants/delete'>'''
                output += '''<h2>Are you sure you want to delete {0}?</h2>'''.format(restaurant.name)
                output += '''<input name="id" type="hidden" value="{0}">'''.format(restaurant.id)
                output += '''<input type="submit" value="Yes">
                </form>'''
                output += "<a href='/restaurants'>Go back to list</a>"
                output += "</body></html>"
                self.wfile.write(output)
                print(output)
                return
        except IOError:
            self.send_error(404, "File Not Found {0}".format(self.path))
    def do_POST(self):
        try:
            if self.path.endswith('new'):
                self.send_response(301)
                self.send_header('Content-type', 'text/html')
                self.end_headers()
                ctype, pdict = cgi.parse_header(self.headers.getheader('content-type'))
                if ctype == 'multipart/form-data':
                    fields=cgi.parse_multipart(self.rfile, pdict)
                    messagecontent = fields.get('message')
                    restaurant = Restaurant()
                    restaurant.name = messagecontent[0]
                    session.add(restaurant)
                    session.commit()
                output = ""
                output += "<html><body>"
                output += " <h2> Okay, saved the restaurant: </h2>"
                output += "<h1> %s </h1>" % messagecontent[0]
                output += "<a href=/restaurants>Restaurants List</a>"
                output += "</body></html>"
                self.wfile.write(output)
                print(output)
            if self.path.endswith('edit'):
                self.send_response(301)
                self.send_header('Content-type', 'text/html')
                self.end_headers()
                ctype, pdict = cgi.parse_header(self.headers.getheader('content-type'))
                if ctype == 'multipart/form-data':
                    fields = cgi.parse_multipart(self.rfile, pdict)
                    restaurant_id = fields.get("id")[0]
                    restaurant = session.query(Restaurant).filter_by(id=restaurant_id).one()
                    restaurant.name = fields.get('message')[0]
                    session.add(restaurant)
                    session.commit()
                output = ""
                output += "<html><body>"
                output += " <h2> Okay, restaurant's name changed to: </h2>"
                output += "<h1> %s </h1>" % restaurant.name
                output += "<a href=/restaurants>Restaurants List</a>"
                output += "</body></html>"
                self.wfile.write(output)
                print(output)
            if self.path.endswith('delete'):
                name = ""
                self.send_response(301)
                self.send_header('Content-type', 'text/html')
                self.end_headers()
                ctype, pdict = cgi.parse_header(self.headers.getheader('content-type'))
                if ctype == 'multipart/form-data':
                    fields = cgi.parse_multipart(self.rfile, pdict)
                    restaurant_id = fields.get("id")[0]
                    restaurant = session.query(Restaurant).filter_by(id=restaurant_id).one()
                    name = restaurant.name
                    session.delete(restaurant)
                    session.commit()
                output = ""
                output += "<html><body>"
                output += " <h2> Okay, deleted %s </h2>" % name
                output += "<a href=/restaurants>Restaurants List</a>"
                output += "</body></html>"
                self.wfile.write(output)
                print(output)
        except Exception as inst:
            self.send_response(501)
            self.send_header('Content-type', 'text/html')
            self.end_headers()
            output = ""
            output += "<html><body>"
            output += " <h2>Uh oh!</h2>"
            output += "</body></html>"
            self.wfile.write(output)
            print(output)
            print(type(inst))
            print(inst.args)
            print(inst)
            pass
def main():
    try:
        port = 8080
        server = HTTPServer(("", port), webserverHandler)
        print("Web server running on port {0}".format(port))
        server.serve_forever(), webbrowser.open("localhost")
    except KeyboardInterrupt:
        print("^C entered, stopping web server...")
        server.socket.close()


if __name__ == '__main__':
    main()
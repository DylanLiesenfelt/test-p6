from flask import Flask, request, jsonify
import yfinance as yf
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
print("Server ON")

# frontend arg getter
def getArg(arg):
    return request.args.get(arg)

def getStock(ticker):
    return yf.Ticker(ticker)

# Price history for charts
@app.route('/api/chartData', methods=['GET']) 
def getChartData():

    ticker = getArg('ticker') 
    period = getArg('period')
    interval = getArg('interval')
    
    # Find ticker on yFin
    stock = getStock(ticker) 

    # Get the history of that stock
    df = stock.history(period=period, interval=interval) 
    df = df.reset_index()
    df['datetime'] = df['Datetime'].dt.strftime('%Y-%m-%d %H:%M') if 'Datetime' in df else df['Date'].dt.strftime('%Y-%m-%d')

    # Price info
    open = stock.info['open']
    current = stock.info['currentPrice']
    change = round(((current - open)/open) * 100, 2)

    # Return data as json object
    return jsonify({
    'dates': df['datetime'].tolist(),
    'prices': df['Close'].tolist(),
    'open': open,
    'current': current,
    'change': change,
    })

@app.route('/api/newsfeed')
def getNewsFeed():

    ticker = getArg('ticker')
    stock = getStock(ticker)
    feedBlock = stock.news[:20] #take 20 related stories for that ticker
    feed = []

    #Jsonify relevant material from request
    for item in feedBlock:
        block = item['content']
        
        thumbnail = None
        try:
            thumbnail = block['thumbnail']['originalUrl']
        except(KeyError, TypeError):
            thumbnail = 'https://s.yimg.com/uu/api/res/1.2/bZ_kOPsxtZ48a0BlxMGOTw--~B/Zmk9c3RyaW07aD0xOTA7cT05NTt3PTI1MDthcHBpZD15dGFjaHlvbg--/https://s.yimg.com/os/creatr-uploaded-images/2021-11/40621510-496f-11ec-bade-b5da9b9bb6b2'
            
        story = {
            'title': block['title'],
            'summary': block['summary'],
            'published': block['pubDate'],
            'link': block['canonicalUrl']['url'],
            'thumbnail': thumbnail
        }
        feed.append(story)

    return jsonify(feed)

@app.route('/api/compare', methods=['GET'])
def compareStocks():
    ticker1 = getArg('ticker1')
    ticker2 = getArg('ticker2')

    def getHistory(ticker):
        stock = getStock(ticker)
        df = stock.history(period='1y', interval='1d')
        df = df.reset_index()
        df['datetime'] = df['Date'].dt.strftime('%Y-%m-%d')
        df['return'] = (df['Close'] / df['Close'].iloc[0] - 1) * 100

        return {
            'ticker': ticker,
            'dates': df['datetime'].tolist(),
            'returns': df['return'].tolist()
        }

    return jsonify({
        'stock1': getHistory(ticker1),
        'stock2': getHistory(ticker2)
    })



if __name__ == '__main__':
    app.run(debug=True)
    print('Server OFF')

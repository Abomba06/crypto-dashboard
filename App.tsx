import React, { useCallback, useEffect, useRef, useState } from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Polyline } from 'react-native-svg';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  StatusBar,
  Text,
  View,
} from 'react-native';
import { dashboardService } from './src/services/dashboardService';
import { DataSourceStatus } from './src/services/dashboardService';
import {
  BotState,
  EvaluationRecord,
  LogEntry,
  MarketEvent,
  PortfolioSummary,
  Position,
  ResearchReport,
  Signal,
  Trade,
  VariantReport,
  ComparisonReport,
} from './src/types/trading';

type RootStackParamList = {
  Tabs: undefined;
  Trades: undefined;
  Evaluations: undefined;
  Reports: undefined;
  State: undefined;
};

type TabParamList = {
  Dashboard: undefined;
  Positions: undefined;
  Signals: undefined;
  News: undefined;
  Logs: undefined;
  More: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

const colors = {
  bg: '#07090d',
  panel: 'rgba(18, 25, 34, 0.88)',
  panelSoft: 'rgba(255, 255, 255, 0.055)',
  border: 'rgba(179, 197, 217, 0.16)',
  text: '#f7fbff',
  muted: '#93a4b5',
  cyan: '#75e6d8',
  blue: '#7ab7ff',
  red: '#ff8a78',
  amber: '#ffd36a',
  violet: '#bba7ff',
};

function formatCurrency(value: number) {
  return `$${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
}

function buildTodayMoneyPath(summary: PortfolioSummary) {
  const startValue = summary.totalValue - summary.todayPnL;
  const progress = [0, 0.16, 0.28, 0.43, 0.58, 0.72, 0.86, 1];
  const pulse = [0, -0.08, 0.1, -0.03, 0.15, 0.05, 0.18, 0];
  const volatility = Math.max(Math.abs(summary.todayPnL) * 0.18, summary.totalValue * 0.0006);

  return progress.map((step, index) => startValue + summary.todayPnL * step + pulse[index] * volatility);
}

function labelColor(value: string) {
  if (['bullish', 'buy', 'accepted', 'running', 'info', 'confirmed', 'high'].includes(value)) return colors.cyan;
  if (['bearish', 'sell', 'rejected', 'stopped', 'error'].includes(value)) return colors.red;
  if (['warn', 'watch', 'pending', 'candidate', 'medium', 'paused'].includes(value)) return colors.amber;
  return colors.violet;
}

function ScreenFrame({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.screen, { paddingTop: Math.max(insets.top, 12) }]}>
      <View style={styles.header}>
        <View style={styles.headerCopy}>
          <Text style={styles.micro}>Crypto Bot Control Center</Text>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
        <Badge label="Live" tone={colors.cyan} />
      </View>
      {children}
    </View>
  );
}

function LiquidCard({ children, style }: { children: React.ReactNode; style?: object }) {
  return (
    <View style={[styles.card, style]}>
      <View style={styles.cardGlow} />
      {children}
    </View>
  );
}

function Badge({ label, tone = colors.violet }: { label: string; tone?: string }) {
  return (
    <View style={[styles.badge, { borderColor: `${tone}55`, backgroundColor: `${tone}1f` }]}>
      <Text style={[styles.badgeText, { color: tone }]}>{label}</Text>
    </View>
  );
}

function Metric({ label, value, tone = colors.text }: { label: string; value: string; tone?: string }) {
  return (
    <View style={styles.metric}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={[styles.metricValue, { color: tone }]} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <LiquidCard>
      <Text style={styles.emptyText}>{label}</Text>
    </LiquidCard>
  );
}

function LoadingState() {
  return (
    <LiquidCard style={styles.centerCard}>
      <ActivityIndicator color={colors.cyan} />
      <Text style={styles.emptyText}>Reading Supabase...</Text>
    </LiquidCard>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <LiquidCard style={styles.centerCard}>
      <Text style={[styles.emptyText, { color: colors.red }]}>{message}</Text>
      <Pressable style={styles.actionButton} onPress={onRetry}>
        <Text style={styles.actionText}>Retry</Text>
      </Pressable>
    </LiquidCard>
  );
}

function MiniChart({ values }: { values: number[] }) {
  const width = 250;
  const height = 70;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const points = values
    .map((value, index) => {
      const x = (index / Math.max(values.length - 1, 1)) * width;
      const y = height - ((value - min) / range) * height;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <Svg width="100%" height={86} viewBox={`0 0 ${width} ${height}`}>
      <Polyline points={points} fill="none" stroke={colors.cyan} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      {values.map((value, index) => {
        const x = (index / Math.max(values.length - 1, 1)) * width;
        const y = height - ((value - min) / range) * height;
        return <Circle key={`${value}-${index}`} cx={x} cy={y} r="3" fill={colors.blue} />;
      })}
    </Svg>
  );
}

function MoneyChangeChart({ values, change }: { values: number[]; change: number }) {
  const positive = change >= 0;
  const start = values[0] ?? 0;
  const end = values[values.length - 1] ?? start;

  return (
    <View style={styles.moneyChartPanel}>
      <View style={styles.rowBetween}>
        <View>
          <Text style={styles.micro}>Today Money Change</Text>
          <Text style={[styles.chartChange, { color: positive ? colors.cyan : colors.red }]}>
            {positive ? '+' : ''}{formatCurrency(change)}
          </Text>
        </View>
        <Badge label={positive ? 'Up Today' : 'Down Today'} tone={positive ? colors.cyan : colors.red} />
      </View>
      <MiniChart values={values} />
      <View style={styles.chartLegend}>
        <Text style={styles.cardMeta}>Open {formatCurrency(start)}</Text>
        <Text style={styles.cardMeta}>Now {formatCurrency(end)}</Text>
      </View>
    </View>
  );
}

function useResource<T>(loader: () => Promise<T>) {
  const loaderRef = useRef(loader);
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loaderRef.current = loader;
  }, [loader]);

  const load = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      setError('');
      setData(await loaderRef.current());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, refreshing, error, reload: () => load(), refresh: () => load(true) };
}

function DashboardScreen() {
  const source = useResource<DataSourceStatus>(() => dashboardService.getDataSourceStatus());
  const summary = useResource<PortfolioSummary>(() => dashboardService.getPortfolioSummary());
  const positions = useResource<Position[]>(() => dashboardService.getPositions());
  const signals = useResource<Signal[]>(() => dashboardService.getSignals());
  const events = useResource<MarketEvent[]>(() => dashboardService.getMarketEvents());

  const refreshing = source.refreshing || summary.refreshing || positions.refreshing || signals.refreshing || events.refreshing;
  const refresh = () => {
    source.refresh();
    summary.refresh();
    positions.refresh();
    signals.refresh();
    events.refresh();
  };

  return (
    <ScreenFrame title="Operational Dashboard" subtitle="Supabase read-only command center">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} tintColor={colors.cyan} onRefresh={refresh} />}
      >
        {summary.loading ? <LoadingState /> : null}
        {summary.error ? <ErrorState message={summary.error} onRetry={summary.reload} /> : null}
        {source.data ? (
          <LiquidCard>
            <View style={styles.rowBetween}>
              <View style={styles.headerCopy}>
                <Text style={styles.micro}>Data Source</Text>
                <Text style={styles.cardTitle}>{source.data.connected ? 'Supabase Live' : 'Mock Fallback'}</Text>
              </View>
              <Badge label={source.data.connected ? 'Live' : 'Mock'} tone={source.data.connected ? colors.cyan : colors.amber} />
            </View>
            <Text style={styles.bodyText}>{source.data.message}</Text>
          </LiquidCard>
        ) : null}
        {summary.data ? (
          <LiquidCard style={styles.heroCard}>
            <View style={styles.rowBetween}>
              <View>
                <Text style={styles.micro}>Portfolio Value</Text>
                <Text style={styles.heroValue}>{formatCurrency(summary.data.totalValue)}</Text>
              </View>
              <Badge label={summary.data.health} tone={labelColor(summary.data.health)} />
            </View>
            <View style={styles.metricGrid}>
              <Metric label="Today P/L" value={`${summary.data.todayPnL >= 0 ? '+' : ''}${formatCurrency(summary.data.todayPnL)}`} tone={summary.data.todayPnL >= 0 ? colors.cyan : colors.red} />
              <Metric label="Open P/L" value={formatCurrency(summary.data.openPnL)} tone={summary.data.openPnL >= 0 ? colors.cyan : colors.red} />
              <Metric label="Buying Power" value={formatCurrency(summary.data.buyingPower)} />
              <Metric label="Regime" value={summary.data.regime} tone={colors.blue} />
            </View>
            <MoneyChangeChart values={buildTodayMoneyPath(summary.data)} change={summary.data.todayPnL} />
          </LiquidCard>
        ) : null}

        <SectionTitle label="Positions" count={positions.data?.length} />
        {positions.data?.slice(0, 2).map((position) => <PositionCard key={position.id} position={position} />)}
        {!positions.loading && positions.data?.length === 0 ? <EmptyState label="No open positions" /> : null}

        <SectionTitle label="Signals" count={signals.data?.length} />
        {signals.data?.slice(0, 2).map((signal) => <SignalCard key={signal.id} signal={signal} />)}

        <SectionTitle label="Market Catalyst" count={events.data?.length} />
        {events.data?.slice(0, 1).map((event) => <EventCard key={event.id} event={event} />)}
      </ScrollView>
    </ScreenFrame>
  );
}

function SectionTitle({ label, count }: { label: string; count?: number }) {
  return (
    <View style={styles.sectionTitle}>
      <Text style={styles.sectionText}>{label}</Text>
      {typeof count === 'number' ? <Badge label={`${count}`} tone={colors.blue} /> : null}
    </View>
  );
}

function PositionCard({ position }: { position: Position }) {
  const profit = position.pnl >= 0;
  return (
    <LiquidCard>
      <View style={styles.rowBetween}>
        <View>
          <Text style={styles.cardTitle}>{position.symbol}</Text>
          <Text style={styles.cardMeta}>{position.name}</Text>
        </View>
        <Badge label={position.trend} tone={labelColor(position.trend)} />
      </View>
      <View style={styles.metricGrid}>
        <Metric label="Price" value={formatCurrency(position.price)} />
        <Metric label="Size" value={String(position.size)} />
        <Metric label="P/L" value={`${profit ? '+' : ''}${formatCurrency(position.pnl)}`} tone={profit ? colors.cyan : colors.red} />
        <Metric label="P/L %" value={`${profit ? '+' : ''}${position.pnlPct.toFixed(2)}%`} tone={profit ? colors.cyan : colors.red} />
      </View>
      <MiniChart values={position.sparkline} />
    </LiquidCard>
  );
}

function SignalCard({ signal }: { signal: Signal }) {
  return (
    <LiquidCard>
      <View style={styles.rowBetween}>
        <View>
          <Text style={styles.cardTitle}>{signal.symbol}</Text>
          <Text style={styles.cardMeta}>{signal.setup}</Text>
        </View>
        <Badge label={signal.status} tone={labelColor(signal.status)} />
      </View>
      <View style={styles.metricGrid}>
        <Metric label="Action" value={signal.action.toUpperCase()} tone={labelColor(signal.action)} />
        <Metric label="Score" value={`${signal.score}`} />
        <Metric label="Trend" value={`${signal.trendScore}`} />
        <Metric label="Regime" value={signal.regime} />
      </View>
      <Text style={styles.bodyText}>{signal.reason}</Text>
    </LiquidCard>
  );
}

function EventCard({ event }: { event: MarketEvent }) {
  return (
    <LiquidCard>
      <View style={styles.rowBetween}>
        <Badge label={event.impact} tone={labelColor(event.impact)} />
        <Badge label={event.sentiment} tone={labelColor(event.sentiment)} />
      </View>
      <Text style={styles.cardTitle}>{event.title}</Text>
      <Text style={styles.bodyText}>{event.description}</Text>
      <Text style={styles.cardMeta}>{event.confirmation} / {event.timestamp}</Text>
    </LiquidCard>
  );
}

function ListScreen<T>({
  title,
  subtitle,
  loader,
  renderItem,
  emptyLabel,
}: {
  title: string;
  subtitle?: string;
  loader: () => Promise<T[]>;
  renderItem: (item: T) => React.ReactElement;
  emptyLabel: string;
}) {
  const resource = useResource<T[]>(loader);

  return (
    <ScreenFrame title={title} subtitle={subtitle}>
      {resource.loading ? <LoadingState /> : null}
      {resource.error ? <ErrorState message={resource.error} onRetry={resource.reload} /> : null}
      {!resource.loading && !resource.error ? (
        <FlatList
          data={resource.data ?? []}
          keyExtractor={(item, index) => ('id' in (item as object) ? String((item as { id: string }).id) : String(index))}
          renderItem={({ item }) => renderItem(item)}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          ListEmptyComponent={<EmptyState label={emptyLabel} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          refreshControl={<RefreshControl refreshing={resource.refreshing} tintColor={colors.cyan} onRefresh={resource.refresh} />}
        />
      ) : null}
    </ScreenFrame>
  );
}

function PositionsScreen() {
  return <ListScreen title="Positions" subtitle="Active portfolio exposure" loader={() => dashboardService.getPositions()} renderItem={(item) => <PositionCard position={item} />} emptyLabel="No open positions" />;
}

function SignalsScreen() {
  return <ListScreen title="Signals" subtitle="Live signal pipeline" loader={() => dashboardService.getSignals()} renderItem={(item) => <SignalCard signal={item} />} emptyLabel="No signals found" />;
}

function NewsScreen() {
  return <ListScreen title="Market Catalysts" subtitle="News and confirmation feed" loader={() => dashboardService.getMarketEvents()} renderItem={(item) => <EventCard event={item} />} emptyLabel="No market events" />;
}

function LogsScreen() {
  return (
    <ListScreen
      title="Telemetry"
      subtitle="Bot logs from Supabase"
      loader={() => dashboardService.getLogs()}
      emptyLabel="No log entries"
      renderItem={(log: LogEntry) => (
        <LiquidCard>
          <View style={styles.rowBetween}>
            <Badge label={log.severity} tone={labelColor(log.severity)} />
            <Text style={styles.cardMeta}>{log.timestamp}</Text>
          </View>
          <Text style={styles.bodyText}>{log.message}</Text>
        </LiquidCard>
      )}
    />
  );
}

function SettingsScreen() {
  return (
    <ScreenFrame title="Settings" subtitle="Read-only mobile console">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <LiquidCard>
          <Text style={styles.cardTitle}>Data Source</Text>
          <Text style={styles.bodyText}>Supabase read-only mode. Mock data is used automatically when live data is unavailable.</Text>
        </LiquidCard>
        <LiquidCard>
          <Text style={styles.cardTitle}>Trading Connections</Text>
          <Text style={styles.bodyText}>Alpaca is intentionally not connected in this app. No trading logic or broker keys are stored here.</Text>
        </LiquidCard>
        <LiquidCard>
          <Text style={styles.cardTitle}>Environment</Text>
          <Text style={styles.bodyText}>Use EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY. Never use a service role key in the app.</Text>
        </LiquidCard>
      </ScrollView>
    </ScreenFrame>
  );
}

function MoreScreen() {
  const navigation = useNavigation<any>();
  const items: Array<{ label: string; route: keyof RootStackParamList; caption: string }> = [
    { label: 'Trades', route: 'Trades', caption: 'Execution timeline' },
    { label: 'Evaluations', route: 'Evaluations', caption: 'Candidate outcomes' },
    { label: 'Reports', route: 'Reports', caption: 'Research summaries' },
    { label: 'State', route: 'State', caption: 'Runtime status' },
  ];

  return (
    <ScreenFrame title="More" subtitle="Secondary console screens">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {items.map((item) => (
          <Pressable key={item.route} onPress={() => navigation.navigate(item.route)}>
            <LiquidCard>
              <View style={styles.rowBetween}>
                <View>
                  <Text style={styles.cardTitle}>{item.label}</Text>
                  <Text style={styles.cardMeta}>{item.caption}</Text>
                </View>
                <Text style={styles.chevron}>{'>'}</Text>
              </View>
            </LiquidCard>
          </Pressable>
        ))}
      </ScrollView>
    </ScreenFrame>
  );
}

function TradesScreen() {
  return (
    <ListScreen
      title="Trades"
      subtitle="Read-only execution timeline"
      loader={() => dashboardService.getTrades()}
      emptyLabel="No trades available"
      renderItem={(trade: Trade) => (
        <LiquidCard>
          <View style={styles.rowBetween}>
            <View>
              <Text style={styles.cardTitle}>{trade.symbol}</Text>
              <Text style={styles.cardMeta}>{trade.timestamp}</Text>
            </View>
            <Badge label={trade.action} tone={labelColor(trade.action)} />
          </View>
          <View style={styles.metricGrid}>
            <Metric label="Price" value={formatCurrency(trade.price)} />
            <Metric label="Qty" value={String(trade.quantity)} />
            <Metric label="Confidence" value={`${Math.round(trade.confidence * 100)}%`} />
            <Metric label="Sentiment" value={trade.sentiment} tone={labelColor(trade.sentiment)} />
          </View>
          <Text style={styles.bodyText}>{trade.reason}</Text>
        </LiquidCard>
      )}
    />
  );
}

function EvaluationsScreen() {
  return (
    <ListScreen
      title="Evaluations"
      subtitle="Signal candidate performance"
      loader={() => dashboardService.getEvaluations()}
      emptyLabel="No evaluations available"
      renderItem={(record: EvaluationRecord) => (
        <LiquidCard>
          <View style={styles.rowBetween}>
            <Text style={styles.cardTitle}>{record.symbol}</Text>
            <Badge label={record.status} tone={labelColor(record.status)} />
          </View>
          <View style={styles.metricGrid}>
            <Metric label="Forward" value={`${record.forwardReturn}%`} />
            <Metric label="MFE" value={`${record.mfe}%`} />
            <Metric label="MAE" value={`${record.mae}%`} />
            <Metric label="TP1" value={record.tp1Hit ? 'Yes' : 'No'} />
          </View>
        </LiquidCard>
      )}
    />
  );
}

function ReportsScreen() {
  const reports = useResource<ResearchReport[]>(() => dashboardService.getResearchReports());
  const variants = useResource<VariantReport[]>(() => dashboardService.getVariantReports());
  const comparisons = useResource<ComparisonReport[]>(() => dashboardService.getComparisonReports());

  return (
    <ScreenFrame title="Reports" subtitle="Read-only research summaries">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {reports.loading || variants.loading || comparisons.loading ? <LoadingState /> : null}
        {reports.data?.map((report) => (
          <LiquidCard key={report.id}>
            <Text style={styles.cardTitle}>{report.name}</Text>
            <Text style={styles.bodyText}>{report.summary}</Text>
            <View style={styles.metricGrid}>
              {Object.entries(report.metrics).map(([key, value]) => <Metric key={key} label={key} value={String(value)} />)}
            </View>
          </LiquidCard>
        ))}
        {variants.data?.map((variant) => (
          <LiquidCard key={variant.id}>
            <Text style={styles.cardTitle}>{variant.variant}</Text>
            <View style={styles.metricGrid}>
              <Metric label="Win Rate" value={`${variant.winRate}`} />
              <Metric label="Avg Return" value={`${variant.avgReturn}%`} />
              <Metric label="R/R" value={`${variant.riskReward}`} />
            </View>
            <Text style={styles.bodyText}>{variant.observations}</Text>
          </LiquidCard>
        ))}
        {comparisons.data?.map((comparison) => (
          <LiquidCard key={comparison.id}>
            <Text style={styles.cardTitle}>{comparison.label}</Text>
            <View style={styles.metricGrid}>
              <Metric label="Current" value={`${comparison.current}`} />
              <Metric label="Benchmark" value={`${comparison.benchmark}`} />
              <Metric label="Delta" value={`${comparison.delta}`} tone={comparison.delta >= 0 ? colors.cyan : colors.red} />
            </View>
          </LiquidCard>
        ))}
      </ScrollView>
    </ScreenFrame>
  );
}

function StateScreen() {
  const resource = useResource<BotState>(() => dashboardService.getBotState());

  return (
    <ScreenFrame title="Bot State" subtitle="Current runtime status">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={resource.refreshing} tintColor={colors.cyan} onRefresh={resource.refresh} />}
      >
        {resource.loading ? <LoadingState /> : null}
        {resource.error ? <ErrorState message={resource.error} onRetry={resource.reload} /> : null}
        {resource.data ? (
          <LiquidCard>
            <View style={styles.metricGrid}>
              <Metric label="Status" value={resource.data.status} tone={labelColor(resource.data.status)} />
              <Metric label="Version" value={resource.data.version} />
              <Metric label="Uptime" value={`${resource.data.uptime}s`} />
              <Metric label="Last Active" value={resource.data.lastActive} />
            </View>
          </LiquidCard>
        ) : null}
      </ScrollView>
    </ScreenFrame>
  );
}

function TabIcon({ focused, label }: { focused: boolean; label: string }) {
  return (
    <View style={[styles.tabIcon, focused && styles.tabIconActive]}>
      <Text style={[styles.tabIconText, focused && styles.tabIconTextActive]}>{label.slice(0, 1)}</Text>
    </View>
  );
}

function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarItemStyle: styles.tabBarItem,
        tabBarActiveTintColor: colors.cyan,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelStyle: styles.tabLabel,
        tabBarIcon: ({ focused }) => <TabIcon focused={focused} label={route.name} />,
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Positions" component={PositionsScreen} />
      <Tab.Screen name="Signals" component={SignalsScreen} />
      <Tab.Screen name="News" component={NewsScreen} />
      <Tab.Screen name="Logs" component={LogsScreen} />
      <Tab.Screen name="More" component={MoreScreen} />
    </Tab.Navigator>
  );
}

function RootStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }}>
      <Stack.Screen name="Tabs" component={Tabs} />
      <Stack.Screen name="Trades" component={TradesScreen} />
      <Stack.Screen name="Evaluations" component={EvaluationsScreen} />
      <Stack.Screen name="Reports" component={ReportsScreen} />
      <Stack.Screen name="State" component={StateScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <NavigationContainer>
          <StatusBar barStyle="light-content" />
          <RootStack />
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
    paddingHorizontal: 14,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    backgroundColor: 'rgba(14, 20, 28, 0.92)',
  },
  headerCopy: {
    flex: 1,
  },
  micro: {
    color: colors.muted,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  title: {
    marginTop: 4,
    color: colors.text,
    fontSize: 24,
    lineHeight: 28,
    fontWeight: '900',
  },
  subtitle: {
    marginTop: 4,
    color: colors.muted,
    fontSize: 13,
  },
  scrollContent: {
    paddingBottom: 118,
    gap: 12,
  },
  card: {
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.panel,
    overflow: 'hidden',
  },
  cardGlow: {
    position: 'absolute',
    top: -50,
    right: -40,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(117, 230, 216, 0.08)',
  },
  centerCard: {
    alignItems: 'center',
    gap: 12,
  },
  heroCard: {
    gap: 16,
  },
  heroValue: {
    marginTop: 6,
    color: colors.text,
    fontSize: 34,
    lineHeight: 38,
    fontWeight: '900',
  },
  moneyChartPanel: {
    marginTop: 2,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(117, 230, 216, 0.18)',
    backgroundColor: 'rgba(117, 230, 216, 0.06)',
  },
  chartChange: {
    marginTop: 6,
    fontSize: 22,
    lineHeight: 26,
    fontWeight: '900',
  },
  chartLegend: {
    marginTop: -4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  sectionTitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
    paddingHorizontal: 4,
  },
  sectionText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '900',
  },
  badge: {
    minHeight: 30,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderRadius: 999,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  metricGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 14,
  },
  metric: {
    width: '47.8%',
    minHeight: 74,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(179, 197, 217, 0.1)',
    backgroundColor: colors.panelSoft,
  },
  metricLabel: {
    color: colors.muted,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  metricValue: {
    marginTop: 7,
    fontSize: 16,
    fontWeight: '900',
  },
  cardTitle: {
    color: colors.text,
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '900',
  },
  cardMeta: {
    marginTop: 4,
    color: colors.muted,
    fontSize: 12,
  },
  bodyText: {
    marginTop: 12,
    color: '#d9e3ec',
    fontSize: 14,
    lineHeight: 20,
  },
  emptyText: {
    color: colors.muted,
    fontSize: 14,
    textAlign: 'center',
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: 'rgba(117, 230, 216, 0.15)',
  },
  actionText: {
    color: colors.cyan,
    fontWeight: '900',
  },
  chevron: {
    color: colors.cyan,
    fontSize: 32,
    lineHeight: 34,
  },
  tabBar: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 12,
    height: 76,
    paddingTop: 8,
    paddingBottom: 10,
    borderTopWidth: 0,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: 'rgba(10, 15, 22, 0.96)',
  },
  tabBarItem: {
    borderRadius: 16,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '800',
    marginTop: 2,
  },
  tabIcon: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  tabIconActive: {
    backgroundColor: 'rgba(117, 230, 216, 0.16)',
  },
  tabIconText: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '900',
  },
  tabIconTextActive: {
    color: colors.cyan,
  },
});
